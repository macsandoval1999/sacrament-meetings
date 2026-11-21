import type { SacramentMeeting } from "./meetings-types";

export interface ApiErrorResponse {
    error: string;
    message: string;
}

export interface PaginatedMeetingsResponse {
    message: string;
    meetings: SacramentMeeting[];
    query: { query?: string };
    sort: { field: "date"; order: "desc" };
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        startItem: number;
        endItem: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        totalMeetings: number;
    };
}
