import { Suspense } from "react";
import { connection } from "next/server";
import MeetingById from "../../../components/meetings/MeetingById";
import MeetingSkeleton from "../../../components/meetings/MeetingSkeleton";
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

async function Connection() {
    await connection();
    return null;
}

async function DynamicMarker() {
    return (
        <Suspense>
            <Connection />
        </Suspense>
    );
}

export default function MeetingPage() {
    return (
        <>
            <Suspense fallback={<MeetingSkeleton />}>
                <MeetingById />
            </Suspense>
            <DynamicMarker />
        </>
    );
}
