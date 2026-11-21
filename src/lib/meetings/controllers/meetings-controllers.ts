/* NOTE:
    These controllers validate HTTP requests, call the meeting models, and
    return JSON responses. Route Handlers delegate to the matching controller.
*/

import type {
    ApiFieldError,
    ApiResponse,
    ApiResponseError,
} from "@/lib/api/api-responses";
import {
    createMeeting as createMeetingInDatabase,
    deleteMeeting as deleteMeetingFromDatabase,
    getMeetingByDate,
    getMeetingById,
    getMeetingsCount,
    getPaginatedMeetings,
    ITEMS_PER_PAGE,
    updateMeeting as updateMeetingInDatabase,
} from "@/lib/meetings/models/meetings-models";
import { MeetingPayloadSchema } from "@/lib/meetings/meetings-schemas";
import {
    isValidISODate,
    parseMeetingId,
} from "@/lib/meetings/meetings-validation";

function getApiResponse<TData>(
    statusCode: number,
    message: string,
    data: TData | null,
    errors: ApiResponseError[] | null = null
) {
    const body: ApiResponse<TData> = {
        statusCode,
        message,
        data,
        errors,
    };

    return Response.json(body, { status: statusCode });
}

function getErrorResponse(
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

async function readJsonBody(
    request: Request
): Promise<{ data: unknown } | { response: Response }> {
    const contentType = request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase();
    if (contentType !== "application/json") {
        return {
            response: getErrorResponse(
                "UNSUPPORTED_MEDIA_TYPE",
                "Expected application/json.",
                415
            ),
        };
    }

    try {
        return { data: await request.json() };
    } catch (error) {
        if (!(error instanceof SyntaxError)) {
            throw error;
        }
        return {
            response: getErrorResponse("INVALID_JSON", "Invalid JSON.", 400),
        };
    }
}

export async function getMeetings(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        if (date !== null && !isValidISODate(date)) {
            return getErrorResponse(
                "INVALID_DATE",
                "Provide a valid date in YYYY-MM-DD format.",
                400
            );
        }

        if (date !== null) {
            const meeting = await getMeetingByDate(date);
            if (!meeting) {
                return getErrorResponse(
                    "NOT_FOUND",
                    "Meeting not found for the provided date.",
                    404
                );
            }
            return getApiResponse(
                200,
                "Meeting retrieved successfully.",
                meeting
            );
        }

        const pageParam = searchParams.get("page");
        let page = 1;
        if (pageParam !== null) {
            page = Number(pageParam);
        }
        if (
            pageParam !== null &&
            (!/^\d+$/.test(pageParam) ||
                !Number.isSafeInteger(page) ||
                page < 1)
        ) {
            return getErrorResponse(
                "INVALID_PAGE",
                "Page must be a positive whole number.",
                400
            );
        }

        const limitParam = searchParams.get("limit");
        let limit = ITEMS_PER_PAGE;
        if (limitParam !== null) {
            limit = Number(limitParam);
        }
        if (
            limitParam !== null &&
            (!/^\d+$/.test(limitParam) ||
                !Number.isSafeInteger(limit) ||
                limit < 1 ||
                limit > 50)
        ) {
            return getErrorResponse(
                "INVALID_LIMIT",
                "Limit must be a whole number between 1 and 50.",
                400
            );
        }
        if (!Number.isSafeInteger((page - 1) * limit)) {
            return getErrorResponse(
                "INVALID_PAGE",
                "Page number is too large for the requested limit.",
                400
            );
        }

        const query = searchParams.get("query") ?? "";
        let totalMeetingsPromise: Promise<number | null> =
            Promise.resolve(null);
        if (query) {
            totalMeetingsPromise = getMeetingsCount();
        }
        const [meetings, totalItems, totalMeetings] = await Promise.all([
            getPaginatedMeetings(query, page, limit),
            getMeetingsCount(query),
            totalMeetingsPromise,
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        let startItem = 0;
        let endItem = 0;
        if (meetings.length > 0) {
            startItem = (page - 1) * limit + 1;
            endItem = startItem + meetings.length - 1;
        }
        let message = "No meetings found for the requested page and search.";
        if (meetings.length > 0) {
            message = "Meetings retrieved successfully.";
        }
        let queryFilter: { query?: string } = {};
        if (query) {
            queryFilter = { query };
        }
        let totalMeetingCount = totalItems;
        if (totalMeetings !== null) {
            totalMeetingCount = totalMeetings;
        }

        return getApiResponse(200, message, {
            meetings,
            query: queryFilter,
            sort: { field: "date", order: "desc" },
            pagination: {
                page,
                limit,
                totalItems,
                startItem,
                endItem,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                totalMeetings: totalMeetingCount,
            },
        });
    } catch (error) {
        console.error("Failed to retrieve meetings:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "Something went wrong. Please try again later.",
            500
        );
    }
}

export async function getMeeting(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseMeetingId((await params).id);
        if (id === null) {
            return getErrorResponse(
                "INVALID_MEETING_ID",
                "The meeting ID is invalid.",
                400
            );
        }

        const meeting = await getMeetingById(id);
        if (!meeting) {
            return getErrorResponse(
                "MEETING_NOT_FOUND",
                "No meeting was found with that ID.",
                404
            );
        }
        return getApiResponse(
            200,
            "Meeting retrieved successfully.",
            meeting
        );
    } catch (error) {
        console.error("Failed to retrieve meeting:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "Something went wrong. Please try again later.",
            500
        );
    }
}

export async function createMeeting(request: Request) {
    try {
        const body = await readJsonBody(request);
        if ("response" in body) {
            return body.response;
        }

        const parsed = MeetingPayloadSchema.safeParse(body.data);
        if (!parsed.success) {
            return getErrorResponse(
                "INVALID_MEETING",
                "The meeting data is invalid.",
                400,
                parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            );
        }

        const meeting = await createMeetingInDatabase(parsed.data);
        return getApiResponse(
            201,
            "Meeting created successfully.",
            meeting
        );
    } catch (error) {
        console.error("Failed to create meeting:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The meeting could not be created.",
            500
        );
    }
}

export async function updateMeeting(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseMeetingId((await params).id);
        if (id === null) {
            return getErrorResponse(
                "INVALID_MEETING_ID",
                "The meeting ID is invalid.",
                400
            );
        }

        const body = await readJsonBody(request);
        if ("response" in body) {
            return body.response;
        }

        const parsed = MeetingPayloadSchema.safeParse(body.data);
        if (!parsed.success) {
            return getErrorResponse(
                "INVALID_MEETING",
                "The meeting data is invalid.",
                400,
                parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            );
        }

        const meeting = await updateMeetingInDatabase(id, parsed.data);
        if (!meeting) {
            return getErrorResponse(
                "MEETING_NOT_FOUND",
                "No meeting was found with that ID.",
                404
            );
        }
        return getApiResponse(
            200,
            "Meeting updated successfully.",
            meeting
        );
    } catch (error) {
        console.error("Failed to update meeting:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The meeting could not be updated.",
            500
        );
    }
}

export async function deleteMeeting(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseMeetingId((await params).id);
        if (id === null) {
            return getErrorResponse(
                "INVALID_MEETING_ID",
                "The meeting ID is invalid.",
                400
            );
        }

        const meeting = await deleteMeetingFromDatabase(id);
        if (!meeting) {
            return getErrorResponse(
                "MEETING_NOT_FOUND",
                "No meeting was found with that ID.",
                404
            );
        }
        return getApiResponse(
            200,
            "Meeting deleted successfully.",
            meeting
        );
    } catch (error) {
        console.error("Failed to delete meeting:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The meeting could not be deleted.",
            500
        );
    }
}
