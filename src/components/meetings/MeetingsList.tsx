"use client";

import { useEffect, useState } from "react";
import { getTodayDate } from "../../lib/helpers";
import type { ApiErrorResponse } from "../../types/api-types";
import type { SacramentMeeting } from "../../types/meetings-types";
import MeetingCard from "./MeetingCard";
import MeetingsListSkeleton from "./MeetingsListSkeleton";

export default function MeetingsList() {
    const [meetings, setMeetings] = useState<SacramentMeeting[] | null>(null);
    const [error, setError] = useState("");
    const [today, setToday] = useState<string | null>(null);

    useEffect(() => {
        let timer: number;

        function updateToday() {
            window.clearTimeout(timer);
            setToday(getTodayDate());
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            timer = window.setTimeout(updateToday, midnight.getTime() - Date.now());
        }

        updateToday();
        document.addEventListener("visibilitychange", updateToday);
        return () => {
            window.clearTimeout(timer);
            document.removeEventListener("visibilitychange", updateToday);
        };
    }, []);

    useEffect(() => {
        let active = true;

        async function loadMeetings() {
            try {
                const response = await fetch("/api/meetings");
                if (!response.ok) {
                    const apiError: ApiErrorResponse = await response.json();
                    if (active) setError(apiError.message);
                    return;
                }

                const data: SacramentMeeting[] = await response.json();
                if (active) setMeetings(data);
            } catch (error) {
                if (active) {
                    console.error("Could not load meetings:", error);
                    setError("Something went wrong. Please try again later.");
                }
            }
        }

        loadMeetings();
        return () => {
            active = false;
        };
    }, []);

    if (error) return <p role="alert" className="mt-8 text-foreground">{error}</p>;
    if (!meetings) return <MeetingsListSkeleton />;
    if (meetings.length === 0) return <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-muted">No meetings are currently available.</p>;

    return (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...meetings].sort((a, b) => b.date.localeCompare(a.date)).map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} conducted={today !== null && meeting.date < today} />
            ))}
        </div>
    );
}
