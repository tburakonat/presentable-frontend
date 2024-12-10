import { useToggleUser, useUser } from "@/context/UserContext";
import Link from "next/link";

export default function Navbar() {
	const user = useUser();
	const toggleUser = useToggleUser();

	return (
		<nav className="flex flex-row justify-between items-center p-4 shadow-md">
			<div>
				<Link
					className="mr-6 text-lg font-medium hover:text-gray-600 transition-colors"
					href="/"
				>
					Home
				</Link>
				<Link
					className="mr-6 text-lg font-medium hover:text-gray-600 transition-colors"
					href="/videos"
				>
					Videos
				</Link>
			</div>

			<div>
				<button className="mr-2" onClick={() => toggleUser?.()}>
					Change role
				</button>
				<Link
					className="font-medium transition-colors"
					href="/profile"
				>
					{
						user?.firstName ? 
						user?.firstName + " " + user?.lastName : 
						"Profile"
					}
				</Link>
			</div>
		</nav>
	);
}
