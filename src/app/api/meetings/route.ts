import { getMeetingByDate, getPaginatedMeetings } from "../../../lib/meetings-db";
import { isValidISODate } from "../../../lib/helpers";

// Get paginated meetings or a meeting by date
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (date !== null) {
        if (!isValidISODate(date)) {
            return Response.json({ error: "Invalid date" }, { status: 400 });
        }

        const meeting = await getMeetingByDate(date);
        return Response.json(meeting ? [meeting] : []);
    }

    const pageParam = searchParams.get("page");
    const page = pageParam === null ? 1 : Number(pageParam);

    if (
        pageParam !== null &&
        (!/^\d+$/.test(pageParam) || !Number.isSafeInteger(page) || page < 1)
    ) {
        return Response.json({ error: "Invalid page number" }, { status: 400 });
    }

    const query = searchParams.get("query") ?? "";
    const meetings = await getPaginatedMeetings(query, page);
    return Response.json(meetings);
}
