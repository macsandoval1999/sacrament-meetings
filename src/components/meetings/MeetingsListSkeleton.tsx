export default function MeetingsListSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading meetings"
            className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
            <span className="sr-only">Loading meetings...</span>
            {Array.from({ length: 6 }, (_, index) => (
                <article
                    key={index}
                    aria-hidden="true"
                    className="h-56 animate-pulse rounded-xl border border-border bg-surface p-6 shadow-sm"
                >
                    <div className="h-3 w-24 rounded bg-border" />
                    <div className="mt-6 h-6 w-3/4 rounded bg-border" />
                    <div className="mt-6 h-4 w-1/2 rounded bg-border" />
                    <div className="mt-8 h-4 w-28 rounded bg-border" />
                </article>
            ))}
        </div>
    );
}
