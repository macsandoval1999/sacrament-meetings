import MeetingForm from "@/components/meetings/MeetingForm";
import { createMeeting } from "@/lib/meetings/actions";

export default function NewMeetingPage() {
    return (
        <section>
            <h1 className="text-3xl font-semibold">New meeting</h1>
            <p className="mb-6 mt-3 text-muted">
                Add the meeting date and complete agenda.
            </p>
            <MeetingForm action={createMeeting} />
        </section>
    );
}
