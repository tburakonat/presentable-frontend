import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
	const searchParams = useSearchParams();
	const next = searchParams.get("next");

	const router = useRouter();
	const { login } = useAuth();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const username = formData.get("username");
		const password = formData.get("password");
		
		try {
			await login(username as string, password as string);
			if (next) {
				router.push(next);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error(error);
			setError("Invalid username or password");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="p-8 rounded-2xl max-w-md w-full">
				<h2 className="text-center text-2xl font-bold">Log in</h2>
				<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
					<label className="text-sm block">Username</label>
					<input
						name="username"
						type="text"
						required
						className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
						placeholder="Enter username"
					/>

					<label className="text-sm block">Password</label>
					<input
						name="password"
						type="password"
						required
						className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
						placeholder="Enter password"
					/>

					<div className="!mt-8">
						<button
							type="submit"
							className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
						>
							Log in
						</button>
					</div>

					{error && (
						<p className="text-red-600 text-sm text-center">
							{error}
						</p>
					)}

					<p className="text-sm !mt-8 text-start">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
						>
							Register here
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}