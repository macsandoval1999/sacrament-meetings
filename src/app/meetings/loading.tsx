import MeetingsListSkeleton from "../../components/meetings/MeetingsListSkeleton";

export default function Loading() {
    return (
        <div aria-busy="true">
            <div aria-hidden="true" className="animate-pulse">
                <div className="h-4 w-20 rounded bg-border" />
                <div className="mt-3 h-10 w-2/3 rounded bg-border" />
                <div className="mt-3 h-5 w-1/2 rounded bg-border" />
            </div>
            <MeetingsListSkeleton />
        </div>
    );
}

