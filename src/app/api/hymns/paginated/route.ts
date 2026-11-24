import { getAllPaginatedHymns } from "@/lib/hymns/controllers/hymns-controllers";

/**
 * @openapi
 * /api/hymns/paginated:
 *   get:
 *     tags: [Hymns]
 *     summary: Search hymns with pagination
 *     parameters:
 *       - in: query
 *         name: query
 *         description: Filter hymns by ID or title, case-insensitively.
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50, default: 50 }
 *     responses:
 *       '200':
 *         description: Paginated hymns and pagination metadata.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedHymns'
 *       '400':
 *         description: Invalid page or limit.
 *       '500':
 *         description: Hymn retrieval failed.
 */
export const GET = getAllPaginatedHymns;
