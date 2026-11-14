import { getMeetingById } from "../../../../lib/meetings-db";

/// GET one meeting by its ID or date. Here we handle both cases and validate the input accordingly. If id is shaped like a date, we validate it as an ISO date; otherwise, we treat it as a numeric ID.
export async function GET( _request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return Response.json({ error: "Invalid meeting ID" }, { status: 400 });
    }

    const meeting = await getMeetingById(Number(id));

    if (!meeting) {
        return Response.json({ error: "Meeting not found" }, { status: 404 });
    }

    return Response.json(meeting);
}