import Link from "next/link";
import { useSession } from "@/context";

const dashboardOptions = [
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

function DashboardPage() {
	const { user } = useSession();

	return (
		<div>
			<h1 className="text-4xl mb-6">Hello {user?.username}</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
				{dashboardOptions.map(option => (
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

export default DashboardPage;
