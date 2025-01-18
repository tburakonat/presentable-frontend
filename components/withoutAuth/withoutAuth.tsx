import { useSession } from "@/context";
import { useRouter } from "next/router";

function withoutAuth(Component: React.ComponentType) {
	return function (props: any) {
		const { user, isLoading } = useSession();
		const router = useRouter();

		if (isLoading) {
			return null;
		}

		if (!isLoading && user) {
			router.push("/dashboard");
			return;
		}

		return <Component {...props} />;
	};
}

export default withoutAuth;
