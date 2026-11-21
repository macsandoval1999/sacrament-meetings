import Link from "next/link";
import { formatMeetingDate } from "../../lib/helpers";
import type { SacramentMeeting } from "../../lib/meetings/meetings-types";
import DeleteMeetingButton from "./DeleteMeetingButton";

export default function MeetingCard({
    meeting,
    conducted = false,
}: {
    meeting: SacramentMeeting;
    conducted?: boolean;
}) {
    const meetingDate = formatMeetingDate(meeting.date);
    let editControl = (
        <Link
            href={`/meetings/${meeting.id}/edit`}
            aria-label={`Edit agenda for ${meetingDate}`}
            className="w-fit font-semibold text-accent hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
            Edit
        </Link>
    );
    if (conducted) {
        editControl = (
            <span
                aria-disabled="true"
                className="w-fit cursor-not-allowed font-semibold text-muted opacity-60"
            >
                Edit
            </span>
        );
    }

    return (
        <article
            className={`relative flex h-full flex-col rounded-xl border p-6 shadow-sm
            ${conducted ? "border-border-conducted bg-surface-conducted" : "border-border bg-surface"}`}
        >
            <p className="pr-24 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {meeting.meeting_type} meeting
            </p>
            {conducted && (
                <p className="absolute right-6 top-6 w-fit whitespace-nowrap rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                    Conducted
                </p>
            )}
            <h2 className="mt-3 text-xl font-semibold">
                <Link
                    href={`/meetings/${meeting.id}`}
                    className="rounded-sm hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    <time dateTime={meeting.date}>
                        {meetingDate}
                    </time>
                </Link>
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
                Conducting: {meeting.conducting}
            </p>
            <Link
                href={`/meetings/${meeting.id}`}
                aria-label={`View agenda for ${meetingDate}`}
                className="mt-6 w-fit font-semibold text-accent hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                View agenda <span aria-hidden="true">&rarr;</span>
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-5">
                {editControl}
                <DeleteMeetingButton id={meeting.id} date={meeting.date} />
            </div>
        </article>
    );
}
