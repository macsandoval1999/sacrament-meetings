import type { ApiFieldError, ApiResponse, ApiResponseError } from "@/lib/api/api-responses";
import type { Hymn } from "@/lib/hymns/hymns-types";
import type { MeetingRecord, SacramentMeeting } from "@/lib/meetings/meetings-types";

// Helper function to format a meeting date string into a human-readable format
export function formatMeetingDate(date: string): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));
}

// Helper function to get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// Helper function to get the upcoming Sunday's date in YYYY-MM-DD format
export function getUpcomingSundayDate(): string {
    // Work in UTC after capturing the local calendar date to avoid time-zone shifts.
    const sunday = new Date(`${getTodayDate()}T00:00:00Z`);
    sunday.setUTCDate(sunday.getUTCDate() + (7 - sunday.getUTCDay()) % 7);
    return sunday.toISOString().slice(0, 10);
}

// Name of the ward
export const wardName = "Adobe Villa Ward";

export function getApiResponse<T>(
    statusCode: number,
    message: string,
    data: T | null,
    errors: ApiResponseError[] | null = null
) {
    const body: ApiResponse<T> = { statusCode, message, data, errors };
    return Response.json(body, { status: statusCode });
}

export function getErrorResponse(
    code: string,
    message: string,
    statusCode: number,
    fieldErrors: ApiFieldError[] = []
) {
    const error: ApiResponseError = { code, message };
    if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors;
    }
    return getApiResponse(statusCode, message, null, [error]);
}

export async function readJsonBody(
    request: Request
): Promise<{ data: unknown } | { response: Response }> {
    const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (contentType !== "application/json") {
        return { response: getErrorResponse("UNSUPPORTED_MEDIA_TYPE", "Expected application/json.", 415) };
    }
    try {
        return { data: await request.json() };
    } catch (error) {
        if (!(error instanceof SyntaxError)) {
            throw error;
        }
        return { response: getErrorResponse("INVALID_JSON", "Invalid JSON.", 400) };
    }
}

export function formatMeeting(meeting: MeetingRecord, hymns: Hymn[]): SacramentMeeting {
    const {
        opening_hymn_id,
        sacrament_hymn_id,
        intermediate_hymn_id,
        musical_number_ids,
        closing_hymn_id,
        ...fields
    } = meeting;
    const opening = hymns.find((hymn) => hymn.id === opening_hymn_id);
    const sacrament = hymns.find((hymn) => hymn.id === sacrament_hymn_id);
    const closing = hymns.find((hymn) => hymn.id === closing_hymn_id);
    if (!opening || !sacrament || !closing) {
        throw new Error(`Meeting ${meeting.id} references a missing hymn.`);
    }
    let intermediate: Hymn | null = null;
    if (intermediate_hymn_id !== null) {
        const hymn = hymns.find((item) => item.id === intermediate_hymn_id);
        if (!hymn) {
            throw new Error(`Meeting ${meeting.id} references a missing intermediate hymn.`);
        }
        intermediate = hymn;
    }
    const musicalNumbers: Hymn[] = [];
    for (const id of musical_number_ids ?? []) {
        const hymn = hymns.find((item) => item.id === id);
        if (!hymn) {
            throw new Error(`Meeting ${meeting.id} references a missing musical hymn.`);
        }
        musicalNumbers.push(hymn);
    }
    return {
        ...fields,
        opening_hymn: opening,
        sacrament_hymn: sacrament,
        intermediate_hymn: intermediate,
        musical_numbers: musicalNumbers,
        closing_hymn: closing,
    };
}
