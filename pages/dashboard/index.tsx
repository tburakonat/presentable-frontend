import Link from "next/link";
import { useSession } from "@/context";
import { withAuth } from "@/components";
import Head from "next/head";

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
	const { user, isLoading } = useSession();

	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<div>
				<h1 className="text-4xl mb-6">Hello {user?.username}</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
					{dashboardOptions.map(option => (
						<Link
							key={option.link}
							href={option.link}
							className="block bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
						>
							{option.name}
						</Link>
					))}
				</div>
			</div>
		</>
	);
}

export default withAuth(DashboardPage);
