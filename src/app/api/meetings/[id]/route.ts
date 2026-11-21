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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingResponse'
 *       '400':
 *         description: Invalid meeting ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '404':
 *         description: No meeting exists for the requested ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '500':
 *         description: The meeting data could not be retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingResponse'
 *       '400':
 *         description: Invalid meeting ID, JSON, or meeting data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '404':
 *         description: No meeting exists for the requested ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '415':
 *         description: The request must use application/json.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '500':
 *         description: The meeting could not be updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingResponse'
 *       '400':
 *         description: Invalid meeting ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '404':
 *         description: No meeting exists for the requested ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '500':
 *         description: The meeting could not be deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
export const GET = getMeeting;
export const PUT = updateMeeting;
export const DELETE = deleteMeeting;
