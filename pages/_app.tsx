import "@/styles/globals.css";
import "@/styles/editor.css";
import "remixicon/fonts/remixicon.css";
import type { AppProps } from "next/app";
import Layout from "./layout";
import { SessionProvider, ReactQueryProvider } from "@/context";
import { Toaster } from "sonner";
import { Provider } from "jotai";
import { editorStore } from "@/atoms";


export default function App({ Component, pageProps }: AppProps) {
	return (
		<ReactQueryProvider>
			<SessionProvider>
				<Provider store={editorStore}>
					<Layout>
						<Component {...pageProps} />
						<Toaster position="bottom-center" />
					</Layout>
				</Provider>
			</SessionProvider>
		</ReactQueryProvider>
	);
}
