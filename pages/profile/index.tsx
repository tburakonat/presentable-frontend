import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
	const { user } = useAuth();

	if (!user) {
		return <p>No user found</p>;
	}

	return (
		<div>
			<h1 className="text-xl">Profile</h1>
			<p>First name: {user.first_name}</p>
			<p>Last name: {user.last_name}</p>
			<p>Email: {user.email}</p>
			<p>Username: {user.username}</p>
            <p>Role: {user.role}</p>
		</div>
	);
}
