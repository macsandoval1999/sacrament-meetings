import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { formatMeetingDate, getUpcomingSundayDate } from "../../../lib/helpers";
import { getMeetingByDate } from "../../../lib/meetings-db";



export default function CurrentMeetingPage() {
    return (
        <Suspense
            fallback={
                <p className="text-muted">
                    Loading this Sunday&apos;s meeting...
                </p>
            }
        >
            <CurrentMeeting />
        </Suspense>
    );
}

async function CurrentMeeting() {
    await connection();
    const date = getUpcomingSundayDate();
    const meeting = getMeetingByDate(date);

    if (meeting) redirect(`/meetings/${meeting.id}?from=current`);

    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-tight">
                Hold tight!
            </h1>
            <p className="mt-4 text-muted">
                Details coming soon for our upcoming {formatMeetingDate(date)}{" "}
                meeting.
            </p>
        </div>
    );
}
