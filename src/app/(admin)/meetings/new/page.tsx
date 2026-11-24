import MeetingForm from "@/components/meetings/MeetingForm";
import { createMeeting } from "@/lib/meetings/meetings-actions";
import { getAllHymns } from "@/lib/hymns/models/hymns-models";
import { Suspense } from "react";

async function NewMeetingForm() {
    const hymns = await getAllHymns();
    return <MeetingForm action={createMeeting} hymns={hymns} />;
}

export default function NewMeetingPage() {
    return (
        <section>
            <h1 className="text-3xl font-semibold">New meeting</h1>
            <p className="mb-6 mt-3 text-muted">
                Add the meeting date and complete agenda.
            </p>
            <Suspense fallback={<p role="status" className="text-muted">Loading hymns...</p>}>
                <NewMeetingForm />
            </Suspense>
        </section>
    );
}
