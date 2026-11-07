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
            <Suspense fallback={<p className="mb-8 py-3 text-sm text-muted">Loading meeting navigation...</p>}>
                <SubNavLinks
                    links={meetingSubNavLinks}
                    label="Meetings sub-navigation"
                />
            </Suspense>
            {children}
        </>
    );    
}