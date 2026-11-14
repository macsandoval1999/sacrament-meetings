import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/behaviors/ScrollToTop";
import "./globals.css";



const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const siteTitle = "Sacrament Meetings";
const siteDescription =
    "Sacrament meeting agendas and ward announcements. View your ward's schedule and updates. Built with Next.js, TypeScript, and Tailwind CSS.";



const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";



export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteTitle,
        template: "%s | Sacrament Meetings",
    },
    description: siteDescription,
    icons: {
        icon: [
            { url: "/favicon.ico", type: "image/x-icon" },
            { url: "/images/ward-logo.svg", type: "image/svg+xml" },
        ],
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: siteTitle,
        title: siteTitle,
        description: siteDescription,
        images: [
            {
                url: "/images/social-preview.png",
                width: 1200,
                height: 630,
                alt: "Adobe Villa Ward sacrament meetings, with an open hymnbook logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
        images: ["/images/social-preview.png"],
    },
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
