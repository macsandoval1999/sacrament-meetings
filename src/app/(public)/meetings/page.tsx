import { Suspense } from "react";
import MeetingList from "@/components/meetings/MeetingsList";
import { MeetingSearch } from "@/components/meetings/MeetingSearch";
import MeetingsListSkeleton from "@/components/meetings/MeetingsListSkeleton";
import type { Metadata } from "next";



export const metadata: Metadata = {
    title: "Meetings",
    description:
        "Sacrament meeting agendas and ward announcements.",
};



export default function MeetingsPage() {
    return (
        <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Agendas</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Sacrament meetings</h1>
            <p className="mt-3 text-muted">Choose a meeting to view its full agenda.</p>
            <Suspense
                fallback={
                    <div
                        role="status"
                        aria-label="Loading meeting search"
                        className="mt-6 max-w-xl"
                    >
                        <span className="sr-only">Loading meeting search...</span>
                        <div
                            aria-hidden="true"
                            className="h-[4.5rem] animate-pulse rounded-lg border border-border bg-surface"
                        />
                    </div>
                }
            >
                <MeetingSearch />
            </Suspense>
            <Suspense fallback={<MeetingsListSkeleton />}>
                <MeetingList />
            </Suspense>
        </div>
    );
}
