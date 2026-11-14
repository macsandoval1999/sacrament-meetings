import { getMeetingById } from "../../../../lib/meetings-db";

// Get one meeting by ID.
export async function GET( _request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return Response.json(
            {
                error: "INVALID_MEETING_ID",
                message: "The meeting ID is invalid.",
            },
            { status: 400 }
        );
    }

    try {
        const meeting = await getMeetingById(Number(id));

        if (!meeting) {
            return Response.json(
                {
                    error: "MEETING_NOT_FOUND",
                    message: "No meeting was found with that ID.",
                },
                { status: 404 }
            );
        }

        return Response.json(meeting);
    } catch (error) {
        console.error("Failed to retrieve meeting:", error);
        return Response.json(
            {
                error: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong. Please try again later.",
            },
            { status: 500 }
        );
    }
}