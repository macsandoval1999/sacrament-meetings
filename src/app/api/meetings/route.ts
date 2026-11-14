import {
    getMeetingByDate,
    getMeetingsTotalPages,
    getPaginatedMeetings,
} from "../../../lib/meetings-db";
import { isValidISODate } from "../../../lib/helpers";

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
        if (date !== null) {
            const meeting = await getMeetingByDate(date);
            return Response.json(meeting ? [meeting] : []);
        }

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

        const query = searchParams.get("query") ?? "";
        const [meetings, totalPages] = await Promise.all([
            getPaginatedMeetings(query, page),
            getMeetingsTotalPages(query),
        ]);
        return Response.json({ meetings, totalPages });
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
