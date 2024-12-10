import { Navbar } from "@/components";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="mt-10 mx-20">
                {children}
            </main>
        </>
    )
}