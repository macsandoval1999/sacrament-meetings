import {
    createHymn,
    getAllHymns,
} from "@/lib/hymns/controllers/hymns-controllers";

/**
 * @openapi
 * /api/hymns:
 *   get:
 *     tags: [Hymns]
 *     summary: Get hymns or search by ID/title
 *     parameters:
 *       - in: query
 *         name: id
 *         description: Look up a single hymn by ID. Do not combine with title or query.
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: title
 *         description: Look up a single hymn by its case-insensitive title.
 *         schema: { type: string }
 *       - in: query
 *         name: query
 *         description: Filter the hymn list by ID or title.
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Hymn or hymn list retrieved.
 *       '400':
 *         description: Invalid hymn search.
 *       '404':
 *         description: Hymn not found.
 *       '500':
 *         description: Hymn retrieval failed.
 *   post:
 *     tags: [Hymns]
 *     summary: Create a hymn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HymnInput'
 *     responses:
 *       '201':
 *         description: Hymn created.
 *       '400':
 *         description: Invalid JSON or hymn data.
 *       '409':
 *         description: Duplicate hymn ID or title.
 *       '415':
 *         description: Expected application/json.
 *       '500':
 *         description: Hymn creation failed.
 */
export const GET = getAllHymns;
export const POST = createHymn;
