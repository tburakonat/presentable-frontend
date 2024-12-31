import type { NextApiRequest, NextApiResponse } from "next";
import { jwtDecode } from "jwt-decode";
import * as cookie from "cookie";
import { User, UserRole } from "@/types";

type DecodedToken = {
	user_id: number;
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	role: UserRole;
};

type SuccessResponse = User;

type ErrorResponse = {
	detail: string;
};

type Response = SuccessResponse | ErrorResponse;

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
	if (req.method !== "POST") {
		return res.status(405).json({
			detail: `Method ${req.method} Not Allowed`,
		});
	}

	const { username, password } = req.body;

	const response = await fetch("http://localhost:8000/api/token/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password }),
	});

	if (response.status !== 200) {
		return res.status(400).json({
			detail: "Invalid credentials",
		});
	}

	const data = await response.json();

	if (!("access" in data) || !("refresh" in data)) {
		return res.status(400).json({
			detail: "No access or refresh token",
		});
	}

	const decoded = jwtDecode<DecodedToken>(data.access);

	if (!decoded.user_id) {
		return res.status(400).json({
			detail: "No id in token",
		});
	}

	return (
		res
			.status(200)
			.setHeader("Set-Cookie", [
				cookie.serialize("access_token", data.access, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					domain:
						process.env.NODE_ENV === "production"
							? ".yourdomain.com"
							: "localhost",
                    path: "/",
                    maxAge: 60 * 60 * 24,
				}),
				cookie.serialize("refresh_token", data.refresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    domain:
                        process.env.NODE_ENV === "production"
                            ? ".yourdomain.com"
                            : "localhost",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 5,
                }),
			])
			.json({
				id: decoded.user_id,
				first_name: decoded.first_name,
				last_name: decoded.last_name,
				email: decoded.email,
				username: decoded.username,
				role: decoded.role,
			})
	);
};
