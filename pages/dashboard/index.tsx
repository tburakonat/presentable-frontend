import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
	const { user } = useAuth();

	const options = [
		{
			name: "View courses",
			link: "/courses",
		},
		{
			name: "View presentations",
			link: "/presentations",
		},
		{
			name: "View profile",
			link: "/profile",
		},
	];

	return (
		<div>
			<h1 className="text-4xl mb-6">
				Hello {user?.username}
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {options.map(option => (
                    <Link
                        key={option.link}
                        href={option.link}
                        className="p-4 shadow-md rounded-md bg-gray-100"
                    >
                        {option.name}
                    </Link>
                ))}
            </div>
		</div>
	);
}
