import type { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie";

type SuccessResponse = {};

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

	if (!req.cookies.refresh_token) {
		return res.status(400).json({
			detail: "Token is invalid or expired",
		});
	}

	return res
		.status(200)
		.setHeader("Set-Cookie", [
			cookie.serialize("access_token", "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				domain:
					process.env.NODE_ENV === "production"
						? ".yourdomain.com"
						: "localhost",
				path: "/",
				expires: new Date(0),
			}),
			cookie.serialize("refresh_token", "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				domain:
					process.env.NODE_ENV === "production"
						? ".yourdomain.com"
						: "localhost",
				path: "/",
                expires: new Date(0),
			}),
		])
		.json({});
};
