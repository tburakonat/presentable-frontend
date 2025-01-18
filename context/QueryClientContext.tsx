import { PropsWithChildren } from "react";
import {
	QueryClientProvider,
	QueryClient,
	HydrationBoundary,
	MutationCache,
} from "@tanstack/react-query";

interface ReactQueryProviderProps extends PropsWithChildren {}

const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	}),
});

export function ReactQueryProvider(props: ReactQueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary>{props.children}</HydrationBoundary>
		</QueryClientProvider>
	);
}
