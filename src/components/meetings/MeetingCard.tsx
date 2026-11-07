import Link from "next/link";
import { formatMeetingDate } from "../../lib/helpers";
import type { SacramentMeeting } from "../../types/meetings-types";



export default function MeetingCard({ meeting, conducted = false }: { meeting: SacramentMeeting; conducted?: boolean }) {
    return (
        <article className={`flex h-full flex-col rounded-xl border p-6 shadow-sm 
            ${conducted ? "border-border-conducted bg-surface-conducted": "border-border bg-surface"}`}>
            
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {meeting.meetingType} meeting
            </p>
            {conducted && (
                <p className="mt-3 w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                    Conducted
                </p>
            )}
            <h2 className="mt-3 text-xl font-semibold">
                <Link
                    href={`/meetings/${meeting.id}`}
                    className="rounded-sm hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    <time dateTime={meeting.date}>
                        {formatMeetingDate(meeting.date)}
                    </time>
                </Link>
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
                Conducting: {meeting.conducting}
            </p>
            <Link
                href={`/meetings/${meeting.id}`}
                aria-label={`View agenda for ${formatMeetingDate(meeting.date)}`}
                className="mt-6 w-fit font-semibold text-accent hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                View agenda <span aria-hidden="true">&rarr;</span>
            </Link>
        </article>
    );
}
