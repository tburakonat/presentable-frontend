import { useSession } from "@/context";
import { useRouter } from "next/router";

function withAuth(Component: React.ComponentType) {
	return function (props: any) {
		const { user, isLoading } = useSession();
		const router = useRouter();

		if (isLoading) {
			return null;
		}

		if (!isLoading && !user) {
			router.push("/login");
			return;
		}

		return <Component {...props} />;
	};
}

export default withAuth;
