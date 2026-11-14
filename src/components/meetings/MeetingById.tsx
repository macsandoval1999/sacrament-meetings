"use client";



import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ApiErrorResponse } from "../../types/api-types";
import type { SacramentMeeting } from "../../types/meetings-types";
import MeetingDetail from "./MeetingDetails";
import MeetingSkeleton from "./MeetingSkeleton";



function MeetingResult({ id }: { id: string }) {
    const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadMeeting() {
            try {
                const response = await fetch(`/api/meetings/${encodeURIComponent(id)}`);
                if (!response.ok) {
                    const apiError: ApiErrorResponse = await response.json();
                    if (active) setError(apiError.message);
                    return;
                }

                const data: SacramentMeeting = await response.json();
                if (active) setMeeting(data);
            } catch (error) {
                if (active) {
                    console.error("Could not load meeting:", error);
                    setError("Something went wrong. Please try again later.");
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
            {/* Check if there's an error ? and return a paragraph with the error message if it does,
                : otherwise check if the meeting exists ? and return the meeting details component if it does,
                : otherwise return the skeleton component */}
            {error ? (<p role="alert">{error}</p>)
                : meeting ? (<MeetingDetail meeting={meeting} />)
                : ( <MeetingSkeleton /> )}
        </div>
    );
}



export default function MeetingById() {
    const { id } = useParams<{ id: string }>();

    return <MeetingResult key={id} id={id} />;
}
