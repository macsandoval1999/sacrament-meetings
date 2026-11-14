"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getTodayDate } from "../../lib/helpers";
import type {
    ApiErrorResponse,
    PaginatedMeetingsResponse,
} from "../../types/api-types";
import type { SacramentMeeting } from "../../types/meetings-types";
import MeetingCard from "./MeetingCard";
import { MeetingPagination } from "./MeetingPagination";
import MeetingsListSkeleton from "./MeetingsListSkeleton";

export default function MeetingsList() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const query = searchParams.get("query")?.trim() ?? "";
    const pageParam = searchParams.get("page");
    const requestedPage = Number(pageParam);
    const page =
        pageParam !== null &&
        /^\d+$/.test(pageParam) &&
        Number.isSafeInteger(requestedPage) &&
        requestedPage > 0
            ? requestedPage
            : 1;
    const [result, setResult] = useState<{
        query: string;
        page: number;
        meetings: SacramentMeeting[];
        totalPages: number;
    } | null>(null);
    const [error, setError] = useState<{
        query: string;
        page: number;
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
                const params = new URLSearchParams({ page: String(page) });
                if (query) params.set("query", query);

                const response = await fetch(`/api/meetings?${params}`);
                if (!response.ok) {
                    const apiError: ApiErrorResponse = await response.json();
                    if (active) {
                        setError({ query, page, message: apiError.message });
                    }
                    return;
                }

                const data: PaginatedMeetingsResponse = await response.json();
                if (active) {
                    if (page > Math.max(data.totalPages, 1)) {
                        const params = new URLSearchParams(window.location.search);
                        params.set("page", String(Math.max(data.totalPages, 1)));
                        router.replace(`${pathname}?${params.toString()}`);
                        return;
                    }

                    setResult({ query, page, ...data });
                    setError(null);
                }
            } catch (error) {
                if (active) {
                    console.error("Could not load meetings:", error);
                    setError({
                        query,
                        page,
                        message: "Something went wrong. Please try again later.",
                    });
                }
            }
        }

        loadMeetings();
        return () => {
            active = false;
        };
    }, [page, pathname, query, router]);

    if (error?.query === query && error.page === page) {
        return (
            <p role="alert" className="mt-8 text-foreground">
                {error.message}
            </p>
        );
    }

    if (!result || result.query !== query || result.page !== page) {
        return <MeetingsListSkeleton />;
    }
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
        <div className="mt-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[...result.meetings]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((meeting) => (
                        <MeetingCard
                            key={meeting.id}
                            meeting={meeting}
                            conducted={today !== null && meeting.date < today}
                        />
                    ))}
            </div>
            <MeetingPagination
                currentPage={page}
                totalPages={result.totalPages}
            />
        </div>
    );
}
