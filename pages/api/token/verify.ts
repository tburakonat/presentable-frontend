import { User, UserRole } from "@/types";
import { jwtDecode } from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";

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

	if (!req.cookies.access_token) {
		return res.status(401).json({
			detail: "No access token available",
		});
	}

	const { status } = await fetch("http://localhost:8000/api/token/verify/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: req.cookies.access_token }),
	});

	if (status !== 200) {
		return res.status(401).json({
			detail: "Invalid access token",
		});
	}

	const decoded = jwtDecode<DecodedToken>(req.cookies.access_token);

	return res
		.status(200)
		.json({
			id: decoded.user_id,
			username: decoded.username,
			email: decoded.email,
			first_name: decoded.first_name,
			last_name: decoded.last_name,
			role: decoded.role,
		});
};
