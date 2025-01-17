import "@/styles/globals.css";
import "@/styles/editor.css";
import 'remixicon/fonts/remixicon.css'
import type { AppProps } from "next/app";
import Layout from "./layout";
import { SessionProvider, ReactQueryProvider } from "@/context";


export default function App({ Component, pageProps }: AppProps) {
	return (
		<ReactQueryProvider>
			<SessionProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</ReactQueryProvider>
	);
}
