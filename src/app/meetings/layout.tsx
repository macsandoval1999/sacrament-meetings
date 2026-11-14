import { Suspense } from "react";
import SubNavLinks from "../../components/layout/SubNavLinks";

const meetingSubNavLinks = [
    { href: "/meetings/current", label: "This Sunday" },
    { href: "/meetings", label: "All Meetings" },
];

export default function MeetingsLayout({ children }: LayoutProps<"/meetings">) {
    return (
        // <> ... </> is a React Fragment. It groups multiple elements together without adding an extra HTML element to the page.
        <>
            <Suspense
                fallback={
                    <div
                        role="status"
                        aria-label="Loading meeting navigation"
                        className="mb-8 flex animate-pulse gap-6 border-b-2 border-border py-3"
                    >
                        <span className="sr-only">
                            Loading meeting navigation...
                        </span>
                        <div className="h-4 w-24 rounded bg-border" />
                        <div className="h-4 w-24 rounded bg-border" />
                    </div>
                }
            >
                <SubNavLinks
                    links={meetingSubNavLinks}
                    label="Meetings sub-navigation"
                />
            </Suspense>
            {children}
        </>
    );    
}