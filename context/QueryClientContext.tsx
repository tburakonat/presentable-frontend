import { PropsWithChildren } from "react";
import {
	QueryClientProvider,
	QueryClient,
	HydrationBoundary,
} from "@tanstack/react-query";

interface ReactQueryProviderProps extends PropsWithChildren {}

const queryClient = new QueryClient();

export function ReactQueryProvider(props: ReactQueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary>{props.children}</HydrationBoundary>
		</QueryClientProvider>
	);
}
