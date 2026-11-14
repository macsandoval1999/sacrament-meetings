"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function MeetingSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const query = term.trim();

        if (query) {
            params.set("query", query);
        } else {
            params.delete("query");
        }
        params.delete("search");
        params.delete("page");

        const queryString = params.toString();
        replace(queryString ? `${pathname}?${queryString}` : pathname);
    }, 300);

    return (
        <div className="mt-6 max-w-xl">
            <label
                htmlFor="meeting-search"
                className="block text-sm font-medium text-foreground"
            >
                Search meetings
            </label>
            <input
                id="meeting-search"
                type="search"
                placeholder="Search by month, date, leader, speaker, hymn, or announcement"
                defaultValue={searchParams.get("query") ?? ""}
                onChange={(event) => handleSearch(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
        </div>
    );
}