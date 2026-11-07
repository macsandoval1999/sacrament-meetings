"use client";



import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { SacramentMeeting } from "../../types/meetings-types";
import MeetingDetail from "./MeetingDetails";



function MeetingResult({ id }: { id: string }) {
    const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadMeeting() {
            try {
                const response = await fetch(`/api/meetings/${encodeURIComponent(id)}`);
                if (response.status === 400 || response.status === 404) {
                    if (active) setError("Meeting not found.");
                    return;
                }
                if (!response.ok) throw new Error(`Meeting request failed: ${response.status}`);
                const data: SacramentMeeting = await response.json();
                if (active) setMeeting(data);
            } catch (error) {
                if (active) {
                    console.error("Could not load meeting:", error);
                    setError("Unable to load the meeting. Please try again later.");
                }
            }
        }

        loadMeeting();
        return () => {
            active = false;
        };
    }, [id]);

    return (
        <div>
            <Link href="/meetings" className="mb-8 inline-block text-sm font-semibold text-accent hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                &larr; All meetings
            </Link>
            {error ? <p role="alert">{error}</p> : meeting ? <MeetingDetail meeting={meeting} /> : <p role="status" className="text-muted">Loading meeting...</p>}
        </div>
    );
}



export default function MeetingById() {
    const { id } = useParams<{ id: string }>();

    return <MeetingResult key={id} id={id} />;
}
