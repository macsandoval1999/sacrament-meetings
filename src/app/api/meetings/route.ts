import {
    createMeeting,
    getMeetings,
} from "@/lib/meetings/controllers/meetings-controllers";

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
 *         description: Case-insensitive partial match across meeting details.
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
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/PaginatedMeetings'
 *                 - $ref: '#/components/schemas/MeetingByDate'
 *       '400':
 *         description: Invalid date, page, or limit.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       '404':
 *         description: No meeting exists for the requested date.
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
 *   post:
 *     tags:
 *       - Meetings
 *     summary: Create a meeting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeetingInput'
 *     responses:
 *       '201':
 *         description: Meeting created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingResponse'
 *       '400':
 *         description: Invalid JSON or meeting data.
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
 *         description: The meeting could not be created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
export const GET = getMeetings;
export const POST = createMeeting;
