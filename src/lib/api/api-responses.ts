/* NOTE:
    These interfaces define the consistent JSON envelope returned by meeting
    API routes. They provide compile-time types, not runtime validation.
*/

import type { SacramentMeeting } from "@/lib/meetings/meetings-types";

export interface ApiFieldError {
    field: string;
    message: string;
}

export interface ApiResponseError {
    code: string;
    message: string;
    fieldErrors?: ApiFieldError[];
}

export interface ApiResponse<TData> {
    statusCode: number;
    message: string;
    data: TData | null;
    errors: ApiResponseError[] | null;
}

export interface PaginatedMeetingsData {
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

export type ApiErrorResponse = ApiResponse<never>;
export type PaginatedMeetingsResponse = ApiResponse<PaginatedMeetingsData>;
export type MeetingByDateResponse = ApiResponse<SacramentMeeting>;
export type MeetingResponse = ApiResponse<SacramentMeeting>;
