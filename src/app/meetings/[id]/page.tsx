import { Suspense } from "react";
import MeetingById from "../../../components/meetings/MeetingById";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Meeting Details",
    description: "View details for a specific sacrament meeting.",
};
    

export default function MeetingPage() {
    return (
        <Suspense fallback={<p className="text-muted">Loading meeting...</p>}>
            <MeetingById />
        </Suspense>
    );
}