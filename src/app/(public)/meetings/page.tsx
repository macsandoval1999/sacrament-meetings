import { Suspense } from "react";
import SectionLoading from "@/components/behaviors/SectionLoading";
import MeetingList from "@/components/meetings/MeetingsList";
import { MeetingSearch } from "@/components/meetings/MeetingSearch";
import Link from "next/link";
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
            <Link
                href="/meetings/new"
                className="mt-5 inline-block rounded-lg bg-action px-4 py-3 font-semibold text-foreground hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                Create a meeting
            </Link>
            <Suspense
                fallback={
                    <SectionLoading
                        label="Loading meeting search..."
                        variant="search"
                    />
                }
            >
                <MeetingSearch />
            </Suspense>
            <Suspense
                fallback={
                    <SectionLoading
                        label="Loading meetings..."
                        variant="meetings"
                    />
                }
            >
                <MeetingList />
            </Suspense>
        </div>
    );
}
