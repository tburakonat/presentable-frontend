import "@/styles/globals.css";
import "@/styles/editor.css";
import 'remixicon/fonts/remixicon.css'
import type { AppProps } from "next/app";
import Layout from "./layout";
import UserProvider from "@/context/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}
