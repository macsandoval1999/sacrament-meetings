import { getMeetingById } from "@/lib/meetings-db";

/**
 * @openapi
 * /api/meetings/{id}:
 *   get:
 *     tags:
 *       - Meetings
 *     summary: Get a meeting by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Meeting ID as a whole number.
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       '200':
 *         description: The requested meeting.
 *       '400':
 *         description: Invalid meeting ID.
 *       '404':
 *         description: No meeting exists for the requested ID.
 *       '500':
 *         description: The meeting data could not be retrieved.
 */
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