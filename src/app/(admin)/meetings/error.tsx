"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MeetingManagementError({
    error,
    retry,
}: {
    error: unknown;
    retry: () => void;
}) {
    useEffect(() => {
        console.error("An unexpected meeting error occurred:", error);
    }, [error]);

    return (
        <section
            role="alert"
            className="max-w-3xl rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
                Something went wrong
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                We couldn&apos;t load the meetings
            </h1>
            <p className="mt-4 text-muted">
                An unexpected error occurred. Try again or return to all
                meetings.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
                <button
                    type="button"
                    onClick={() => retry()}
                    className="rounded-lg bg-action px-4 py-3 font-semibold text-foreground hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    Try Again
                </button>
                <Link
                    href="/meetings"
                    className="rounded-sm font-semibold text-accent underline underline-offset-4 hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    Back to meetings
                </Link>
            </div>
        </section>
    );
}
