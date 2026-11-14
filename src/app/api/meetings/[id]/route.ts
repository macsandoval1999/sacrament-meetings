import { getMeetingByDate, getMeetingById } from "../../../../lib/meetings-db";
import { isValidISODate } from "../../../../lib/helpers";

/// GET one meeting by its ID or date. Here we handle both cases and validate the input accordingly. If id is shaped like a date, we validate it as an ISO date; otherwise, we treat it as a numeric ID.
export async function GET( _request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (/^\d{4}-\d{2}-\d{2}$/.test(id)) {
        if (!isValidISODate(id)) {
            return Response.json({ error: "Invalid date" }, { status: 400 });
        }

        const meeting = await getMeetingByDate(id);
        if (!meeting) {
            return Response.json({ error: "Meeting not found" }, { status: 404 });
        }

        return Response.json(meeting);
    }

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return Response.json({ error: "Invalid meeting ID" }, { status: 400 });
    }

    const meeting = await getMeetingById(Number(id));

    if (!meeting) {
        return Response.json({ error: "Meeting not found" }, { status: 404 });
    }

    return Response.json(meeting);
}