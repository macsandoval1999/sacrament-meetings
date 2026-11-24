import {
    deleteMeeting,
    getMeeting,
    updateMeeting,
} from "@/lib/meetings/controllers/meetings-controllers";

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
 *   put:
 *     tags:
 *       - Meetings
 *     summary: Replace a meeting by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeetingInput'
 *     responses:
 *       '200':
 *         description: Meeting updated.
 *       '400':
 *         description: Invalid meeting ID, JSON, or meeting data.
 *       '404':
 *         description: No meeting exists for the requested ID.
 *       '415':
 *         description: The request must use application/json.
 *       '409':
 *         description: A meeting already exists for the requested date.
 *       '500':
 *         description: The meeting could not be updated.
 *   delete:
 *     tags:
 *       - Meetings
 *     summary: Delete a meeting by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       '200':
 *         description: Meeting deleted; the response data contains the deleted meeting.
 *       '400':
 *         description: Invalid meeting ID.
 *       '404':
 *         description: No meeting exists for the requested ID.
 *       '500':
 *         description: The meeting could not be deleted.
 */
export const GET = getMeeting;
export const PUT = updateMeeting;
export const DELETE = deleteMeeting;
