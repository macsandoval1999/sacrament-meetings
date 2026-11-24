import { Suspense } from "react";
import MeetingForm from "@/components/meetings/MeetingForm";
import { updateMeeting } from "@/lib/meetings/meetings-actions";
import { getMeetingById } from "@/lib/meetings/models/meetings-models";
import { notFound } from "next/navigation";
import { getAllHymns } from "@/lib/hymns/models/hymns-models";

interface EditMeetingPageProps {
    params: Promise<{ id: string }>;
}

async function EditMeetingForm({ params }: EditMeetingPageProps) {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
        notFound();
    }

    const meetingId = Number(id);
    if (
        !Number.isSafeInteger(meetingId) ||
        meetingId < 0 ||
        meetingId > 2147483647
    ) {
        notFound();
    }

    const meeting = await getMeetingById(meetingId);
    if (!meeting) {
        notFound();
    }

    const action = updateMeeting.bind(null, id);
    const hymns = await getAllHymns();
    return <MeetingForm action={action} meeting={meeting} hymns={hymns} />;
}

export default function EditMeetingPage({ params }: EditMeetingPageProps) {
    return (
        <section>
            <h1 className="text-3xl font-semibold">Edit meeting</h1>
            <p className="mb-6 mt-3 text-muted">
                Update the meeting date and agenda.
            </p>
            <Suspense
                fallback={
                    <p role="status" className="text-muted">
                        Loading meeting...
                    </p>
                }
            >
                <EditMeetingForm params={params} />
            </Suspense>
        </section>
    );
}
