import {
    getMeetingByDate,
    getMeetingsCount,
    getPaginatedMeetings,
    ITEMS_PER_PAGE,
} from "@/lib/meetings-db";
import { isValidISODate } from "@/lib/helpers";

/**
 * @openapi
 * /api/meetings:
 *   get:
 *     tags:
 *       - Meetings
 *     summary: Get paginated meetings or a meeting by date
 *     description: When date is provided, page, limit, and query are ignored. Otherwise, results are ordered by date descending.
 *     parameters:
 *       - in: query
 *         name: date
 *         description: Find the meeting for this calendar date in YYYY-MM-DD format.
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: query
 *         description: Case-insensitive partial match across meeting details, including dates, month names, leaders, hymns, speakers, and announcements.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: Page number for the filtered meeting list (default is 1).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Number of meetings per page (default is 6, maximum is 50).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 6
 *     responses:
 *       '200':
 *         description: A paginated meeting list, or the meeting for the requested date.
 *       '400':
 *         description: Invalid date, page, or limit.
 *       '404':
 *         description: No meeting exists for the requested date.
 *       '500':
 *         description: The meeting data could not be retrieved.
 */
// Get paginated meetings or a meeting by date
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (date !== null && !isValidISODate(date)) {
        return Response.json(
            {
                error: "INVALID_DATE",
                message: "Provide a valid date in YYYY-MM-DD format.",
            },
            { status: 400 }
        );
    }

    try {
        // If a date is provided, return the meeting for that date
        if (date !== null) {
            const meeting = await getMeetingByDate(date);
            if (!meeting) {
                return Response.json({
                    error: "NOT_FOUND",
                    message: "Meeting not found for the provided date."
                }, { status: 404 });
            }
            return Response.json({
                message: "Meeting retrieved successfully.",
                meeting
            }, { status: 200 });
        }

        // If no date is provided, continue to handle paginated meetings
        const pageParam = searchParams.get("page");
        const page = pageParam === null ? 1 : Number(pageParam);

        if (
            pageParam !== null &&
            (!/^\d+$/.test(pageParam) ||
                !Number.isSafeInteger(page) ||
                page < 1)
        ) {
            return Response.json(
                {
                    error: "INVALID_PAGE",
                    message: "Page must be a positive whole number.",
                },
                { status: 400 }
            );
        }

        const limitParam = searchParams.get("limit");
        const limit = limitParam === null ? ITEMS_PER_PAGE : Number(limitParam);
        if (
            limitParam !== null &&
            (!/^\d+$/.test(limitParam) ||
                !Number.isSafeInteger(limit) ||
                limit < 1 ||
                limit > 50)
        ) {
            return Response.json(
                {
                    error: "INVALID_LIMIT",
                    message: "Limit must be a whole number between 1 and 50.",
                },
                { status: 400 }
            );
        }

        if (!Number.isSafeInteger((page - 1) * limit)) {
            return Response.json(
                {
                    error: "INVALID_PAGE",
                    message: "Page number is too large for the requested limit.",
                },
                { status: 400 }
            );
        }

        const query = searchParams.get("query") ?? "";
        const [meetings, totalItems, totalMeetings] = await Promise.all([
            getPaginatedMeetings(query, page, limit),
            getMeetingsCount(query),
            query ? getMeetingsCount() : Promise.resolve(null),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        const startItem = meetings.length > 0 ? (page - 1) * limit + 1 : 0;
        const endItem = meetings.length > 0 ? startItem + meetings.length - 1 : 0;
        return Response.json({
            message: meetings.length > 0
                ? "Meetings retrieved successfully."
                : "No meetings found for the requested page and search.",
            meetings,
            query: query ? { query } : {},
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
                totalMeetings: totalMeetings ?? totalItems,
            },
        }, { status: 200 });
    } catch (error) {
        console.error("Failed to retrieve meetings:", error);
        return Response.json(
            {
                error: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong. Please try again later.",
            },
            { status: 500 }
        );
    }
}
