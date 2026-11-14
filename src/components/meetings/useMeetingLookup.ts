import { useEffect, useState } from "react";
import type { SacramentMeeting } from "../../types/meetings-types";

type LookupStatus = "loading" | "found" | "not-found" | "error";
type LookupKind = "id" | "date";

export function useMeetingLookup(kind: LookupKind, value: string | null) {
    const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
    const [status, setStatus] = useState<LookupStatus>("loading");

    useEffect(() => {
        if (!value) return;

        const lookupValue = value;
        let active = true;

        async function loadMeeting() {
            try {
                const path = kind === "date"
                    ? `/api/meetings?date=${encodeURIComponent(lookupValue)}`
                    : `/api/meetings/${encodeURIComponent(lookupValue)}`;
                const response = await fetch(path);

                if (response.status === 400 || response.status === 404) {
                    if (active) setStatus("not-found");
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Meeting request failed: ${response.status}`);
                }

                const result: SacramentMeeting | SacramentMeeting[] =
                    await response.json();
                if (!active) return;

                const foundMeeting = Array.isArray(result)
                    ? result[0] ?? null
                    : result;
                if (foundMeeting) {
                    setMeeting(foundMeeting);
                    setStatus("found");
                } else {
                    setStatus("not-found");
                }
            } catch (error) {
                if (active) {
                    console.error("Could not load meeting:", error);
                    setStatus("error");
                }
            }
        }

        void loadMeeting();
        return () => {
            active = false;
        };
    }, [kind, value]);

    return { meeting, status };
}
