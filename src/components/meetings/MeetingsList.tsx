"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTodayDate } from "../../lib/helpers";
import type { ApiErrorResponse } from "../../types/api-types";
import type { SacramentMeeting } from "../../types/meetings-types";
import MeetingCard from "./MeetingCard";
import MeetingsListSkeleton from "./MeetingsListSkeleton";

export default function MeetingsList() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query")?.trim() ?? "";
    const [result, setResult] = useState<{
        query: string;
        meetings: SacramentMeeting[];
    } | null>(null);
    const [error, setError] = useState<{
        query: string;
        message: string;
    } | null>(null);
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
                const search = query
                    ? `?query=${encodeURIComponent(query)}`
                    : "";
                const response = await fetch(`/api/meetings${search}`);
                if (!response.ok) {
                    const apiError: ApiErrorResponse = await response.json();
                    if (active) {
                        setError({ query, message: apiError.message });
                    }
                    return;
                }

                const data: SacramentMeeting[] = await response.json();
                if (active) {
                    setResult({ query, meetings: data });
                    setError(null);
                }
            } catch (error) {
                if (active) {
                    console.error("Could not load meetings:", error);
                    setError({
                        query,
                        message: "Something went wrong. Please try again later.",
                    });
                }
            }
        }

        loadMeetings();
        return () => {
            active = false;
        };
    }, [query]);

    if (error?.query === query) {
        return (
            <p role="alert" className="mt-8 text-foreground">
                {error.message}
            </p>
        );
    }

    if (!result || result.query !== query) return <MeetingsListSkeleton />;
    if (result.meetings.length === 0) {
        return (
            <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-muted">
                {query
                    ? "No meetings match your search."
                    : "No meetings are currently available."}
            </p>
        );
    }

    return (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...result.meetings].sort((a, b) => b.date.localeCompare(a.date)).map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} conducted={today !== null && meeting.date < today} />
            ))}
        </div>
    );
}
