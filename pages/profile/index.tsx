import { Breadcrumbs, withAuth } from "@/components";
import { useSession } from "@/context";
import Head from "next/head";

const breadcrumbs = [
	{ title: "Dashboard", link: "/dashboard" },
	{ title: "Profile", link: "/profile" },
];

function ProfilePage() {
	const { user } = useSession();

	return (
		<>
			<Head>
				<title>Profile</title>
			</Head>
			<div className="container mx-auto p-6">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="text-2xl my-6">Profile</h1>
				<p>First name: {user?.first_name}</p>
				<p>Last name: {user?.last_name}</p>
				<p>Email: {user?.email}</p>
				<p>Username: {user?.username}</p>
				<p>Role: {user?.role}</p>
			</div>
		</>
	);
}

export default withAuth(ProfilePage);
