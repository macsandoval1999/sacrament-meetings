import { parseWholeNumber } from "@/lib/validate";
import { getAllHymns } from "@/lib/hymns/models/hymns-models";
import type { MeetingFormState, MeetingRecord } from "@/lib/meetings/meetings-types";

export function isValidISODate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

export function parseMeetingId(value: string): number | null {
    return parseWholeNumber(value, 0, 2147483647);
}

export async function validateMeetingHymns(meeting: Omit<MeetingRecord, "id">) {
    const hymns = await getAllHymns();
    const errors: MeetingFormState["errors"] = {};
    if (!hymns.some((hymn) => hymn.id === meeting.opening_hymn_id)) {
        errors.opening_hymn_id = ["Select an existing hymn."];
    }
    if (!hymns.some((hymn) => hymn.id === meeting.sacrament_hymn_id)) {
        errors.sacrament_hymn_id = ["Select an existing hymn."];
    }
    if (meeting.intermediate_hymn_id !== null &&
        !hymns.some((hymn) => hymn.id === meeting.intermediate_hymn_id)) {
        errors.intermediate_hymn_id = ["Select an existing hymn."];
    }
    if (meeting.musical_number_ids.some((id) => !hymns.some((hymn) => hymn.id === id))) {
        errors.musical_number_ids = ["Select existing hymns."];
    }
    if (!hymns.some((hymn) => hymn.id === meeting.closing_hymn_id)) {
        errors.closing_hymn_id = ["Select an existing hymn."];
    }
    return errors;
}
