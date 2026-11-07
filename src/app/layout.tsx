import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/behaviors/ScrollToTop";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
    title: "Sacrament Meetings",
    description: "Sacrament meeting agendas and ward announcements.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        // antialiased is a class that applies font smoothing to improve the appearance of text on the screen.
        <html lang="en" className={`${geist.variable} h-full antialiased`}>
            <body className="min-h-full">
                {/* Suspense is used to wrap components that may have asynchronous behavior, providing a fallback UI while they are loading. In this case, it wraps the ScrollToTop component. This ensures that if ScrollToTop has any asynchronous logic, the UI will not break and will show the fallback (null) until it is ready. The fallback can be replaced with any other React node to display a loading indicator if desired. */}
                <Suspense fallback={null}>
                    <ScrollToTop />
                </Suspense>
                <Header />
                <div className="flex min-h-screen flex-col lg:pl-72">
                    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
