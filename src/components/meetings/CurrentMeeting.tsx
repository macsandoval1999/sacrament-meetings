"use client";

import { useEffect, useState } from "react";
import { formatMeetingDate, getUpcomingSundayDate } from "../../lib/helpers";
import MeetingDetails from "./MeetingDetails";
import type { ApiErrorResponse } from "../../types/api-types";
import type { SacramentMeeting } from "../../types/meetings-types";
import MeetingSkeleton from "./MeetingSkeleton";

export default function CurrentMeeting() {
    const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadMeeting() {
            const meetingDate = getUpcomingSundayDate();

            try {
                const response = await fetch(`/api/meetings?date=${encodeURIComponent(meetingDate)}`);
                if (!response.ok) {
                    const apiError: ApiErrorResponse = await response.json();
                    if (active) setError(apiError.message);
                    return;
                }

                const meetings: SacramentMeeting[] = await response.json();
                if (!active) return;

                setDate(meetingDate);
                if (meetings.length > 0) setMeeting(meetings[0]);
            } catch (error) {
                if (active) {
                    console.error("Could not load this Sunday's meeting:", error);
                    setError(
                        "Something went wrong. Please try again later."
                    );
                }
            }
        }

        loadMeeting();
        return () => {
            active = false;
        };
    }, []);

    if (error) {
        return <p role="alert" className="text-foreground">{error}</p>;
    }

    if (meeting) {
        return <MeetingDetails meeting={meeting} />;
    }

    if (date) {
        return (
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Hold tight!
                </h1>
                <p className="mt-4 text-muted">
                    Details coming soon for our upcoming {formatMeetingDate(date)}{" "}
                    meeting.
                </p>
            </div>
        );
    }

    return <MeetingSkeleton />;
}
