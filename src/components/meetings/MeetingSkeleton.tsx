export default function MeetingSkeleton() {
    return (
        <div role="status" aria-label="Loading meeting details">
            <span className="sr-only">Loading meeting details...</span>
            <div aria-hidden="true" className="animate-pulse">
                <div className="h-4 w-28 rounded bg-border" />
                <div className="mt-4 h-10 w-2/3 rounded bg-border" />
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="h-40 rounded-xl border border-border bg-surface" />
                    <div className="h-40 rounded-xl border border-border bg-surface" />
                </div>
                <div className="mt-6 h-[32rem] rounded-xl border border-border bg-surface" />
            </div>
        </div>
    );
}
