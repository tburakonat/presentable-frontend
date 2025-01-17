import { useSession } from "@/context";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
	const router = useRouter();
	const { user, logout } = useSession();

	const handleLogout = async () => {
		logout();
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
				{user?.id ? (
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
