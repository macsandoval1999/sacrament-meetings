import { Suspense } from "react";
import MeetingById from "../../../components/meetings/MeetingById";

export default function MeetingPage() {
    return (
        <Suspense fallback={<p className="text-muted">Loading meeting...</p>}>
            <MeetingById />
        </Suspense>
    );
}