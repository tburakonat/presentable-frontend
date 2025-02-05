import Link from "next/link";
import { useSession } from "@/context";
import { withAuth, Breadcrumbs } from "@/components";
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

const breadcrumbs = [
	{
		title: "Dashboard",
		link: "/dashboard",
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
			<div className="p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="text-2xl my-6">Hello {user?.username}</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
					{dashboardOptions.map(option => (
						<Link
							key={option.link}
							href={option.link}
							className="block bg-white dark:bg-slate-800 border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
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
