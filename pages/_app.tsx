import "@/styles/globals.css";
import "@/styles/editor.css";
import 'remixicon/fonts/remixicon.css'
import type { AppProps } from "next/app";
import Layout from "./layout";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}
