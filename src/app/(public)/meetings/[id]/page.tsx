import { Suspense } from "react";
import SectionLoading from "@/components/behaviors/SectionLoading";
import MeetingDetails from "@/components/meetings/MeetingDetails";
import { getMeetingById } from "@/lib/meetings/models/meetings-models";
import { parseMeetingId } from "@/lib/meetings/meetings-validation";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";


export async function generateMetadata({
    params,
}: PageProps<"/meetings/[id]">): Promise<Metadata> {
    const { id } = await params;

    return {
        title: `Meeting #${id}`,
        description: `View the agenda, hymns, speakers, and announcements for sacrament meeting #${id}.`,
    };
}

async function MeetingContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const meetingId = parseMeetingId(id);
    if (meetingId === null) {
        notFound();
    }

    const meeting = await getMeetingById(meetingId);
    if (!meeting) {
        notFound();
    }

    return (
        <>
            <Link
                href="/meetings"
                className="mb-8 inline-block text-sm font-semibold text-accent hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                &larr; All meetings
            </Link>
            <MeetingDetails meeting={meeting} />
        </>
    );
}

export default function MeetingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense
            fallback={
                <SectionLoading
                    label="Loading meeting details..."
                    variant="meeting-details"
                />
            }
        >
            <MeetingContent params={params} />
        </Suspense>
    );
}
