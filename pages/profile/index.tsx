import { withAuth } from "@/components";
import { useSession } from "@/context";
import Head from "next/head";

function ProfilePage() {
	const { user } = useSession();

	return (
		<>
			<Head>
				<title>Profile</title>
			</Head>
			<div>
				<h1 className="text-xl">Profile</h1>
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
