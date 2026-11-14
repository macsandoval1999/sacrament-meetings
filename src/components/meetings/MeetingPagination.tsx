"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function MeetingPagination({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    function createPageURL(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(page));
        return `${pathname}?${params.toString()}`;
    }

    return (
        <nav
            aria-label="Meeting pagination"
            className="mt-8 flex items-center justify-between border-t border-border pt-5"
        >
            {currentPage > 1 ? (
                <Link
                    href={createPageURL(currentPage - 1)}
                    aria-label="Go to previous page"
                    className="rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    <span aria-hidden="true">&larr;</span> Previous
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-semibold text-muted opacity-60"
                >
                    <span aria-hidden="true">&larr;</span> Previous
                </span>
            )}
            <p aria-live="polite" className="text-sm text-muted">
                Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
            </p>
            {currentPage < totalPages ? (
                <Link
                    href={createPageURL(currentPage + 1)}
                    aria-label="Go to next page"
                    className="rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    Next <span aria-hidden="true">&rarr;</span>
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-semibold text-muted opacity-60"
                >
                    Next <span aria-hidden="true">&rarr;</span>
                </span>
            )}
        </nav>
    );
}
