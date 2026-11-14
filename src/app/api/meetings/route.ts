import { getAllMeetings } from "../../../lib/meetings-db";

// /api/meetings
export async function GET(request: Request) {
    const date = new URL(request.url).searchParams.get("date");
    return Response.json(await getAllMeetings(date));
}
