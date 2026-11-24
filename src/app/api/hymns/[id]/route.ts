import {
    deleteHymnById,
    getHymnById,
    updateHymnById,
} from "@/lib/hymns/controllers/hymns-controllers";

/**
 * @openapi
 * /api/hymns/{id}:
 *   get:
 *     tags: [Hymns]
 *     summary: Get a hymn by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       '200':
 *         description: Hymn retrieved.
 *       '400': { description: Invalid hymn ID }
 *       '404': { description: Hymn not found }
 *       '500': { description: Hymn retrieval failed }
 *   put:
 *     tags: [Hymns]
 *     summary: Replace a hymn by ID
 *     description: The request ID must match the ID in the URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HymnInput' }
 *     responses:
 *       '200':
 *         description: Hymn updated.
 *       '400': { description: Invalid hymn ID, JSON, or hymn data }
 *       '404': { description: Hymn not found }
 *       '409': { description: Duplicate hymn title }
 *       '415': { description: Expected application/json }
 *       '500': { description: Hymn update failed }
 *   delete:
 *     tags: [Hymns]
 *     summary: Delete a hymn by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       '200':
 *         description: Deleted hymn.
 *       '400': { description: Invalid hymn ID }
 *       '404': { description: Hymn not found }
 *       '409': { description: Hymn is used by a meeting }
 *       '500': { description: Hymn deletion failed }
 */
export const GET = getHymnById;
export const PUT = updateHymnById;
export const DELETE = deleteHymnById;
