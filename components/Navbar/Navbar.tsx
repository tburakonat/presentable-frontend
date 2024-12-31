import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
	const router = useRouter();
	const { user, isAuthenticated, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<nav className="flex flex-row justify-between items-center p-4 shadow-md">
			<div>
				<Link
					className="mr-6 text-lg font-medium hover:text-gray-600 transition-colors"
					href="/"
				>
					Home
				</Link>
			</div>

			<div>
				{isAuthenticated ? (
					<>
						<Link
							className="mr-6 text-lg font-medium hover:text-gray-600 transition-colors"
							href="/dashboard"
						>
							Dashboard
						</Link>
						<button
							onClick={handleLogout}
							className="mr-6 text-lg font-medium hover:text-gray-600 transition-colors"
						>
							Logout
						</button>
					</>
				) : (
					<Link
						className="mr-6 text-lg font-medium hover:text-gray-600 transition-colors"
						href="/login"
					>
						Login
					</Link>
				)}
			</div>
		</nav>
	);
}
