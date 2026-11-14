import type { SacramentMeeting } from "./meetings-types";

export interface ApiErrorResponse {
    error: string;
    message: string;
}

export interface PaginatedMeetingsResponse {
    meetings: SacramentMeeting[];
    totalPages: number;
}
