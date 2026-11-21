/* NOTE:
    This shared page is rendered when a meeting route calls notFound() for an
    invalid ID or a meeting that is no longer in the database.
*/

import Link from "next/link";

export default function MeetingNotFound() {
    return (
        <section className="max-w-3xl rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
                Not found
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Meeting not found
            </h1>
            <p className="mt-4 text-muted">
                This meeting does not exist or is no longer available.
            </p>
            <Link
                href="/meetings"
                className="mt-6 inline-block rounded-lg bg-action px-4 py-3 font-semibold text-foreground hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                Back to meetings
            </Link>
        </section>
    );
}
