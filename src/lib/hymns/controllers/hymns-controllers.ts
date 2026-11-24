import { getApiResponse, getErrorResponse, readJsonBody } from "@/lib/helpers";
import { isDuplicateError } from "@/lib/validate";
import {
    createHymn as addHymn,
    deleteHymnById as removeHymnById,
    getHymnByTitle as findHymnByTitle,
    getAllHymns as findAllHymns,
    getHymnById as findHymnById,
    updateHymnById as editHymnById,
} from "../models/hymns-models";
import { HymnSchema } from "../hymns-schemas";
import { parseHymnId } from "../hymns-validation";

export async function getAllHymns(request: Request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const id = searchParams.get("id");
        const title = searchParams.get("title");
        const query = searchParams.get("query");
        if ([id, title, query].filter((value) => value !== null).length > 1) {
            return getErrorResponse("INVALID_HYMN_SEARCH", "Use only one hymn search parameter.", 400);
        }
        if (id !== null) {
            const hymnId = parseHymnId(id);
            if (hymnId === null) {
                return getErrorResponse("INVALID_HYMN_ID", "Hymn ID must be a positive whole number.", 400);
            }
            const hymn = await findHymnById(hymnId);
            if (!hymn) {
                return getErrorResponse("HYMN_NOT_FOUND", "No hymn was found for that ID.", 404);
            }
            return getApiResponse(200, "Hymn retrieved successfully.", hymn);
        }
        if (title !== null) {
            if (!title.trim()) {
                return getErrorResponse("INVALID_HYMN_SEARCH", "Hymn title cannot be empty.", 400);
            }
            const hymn = await findHymnByTitle(title);
            if (!hymn) {
                return getErrorResponse("HYMN_NOT_FOUND", "No hymn was found for that title.", 404);
            }
            return getApiResponse(200, "Hymn retrieved successfully.", hymn);
        }
        const hymns = await findAllHymns();
        if (query !== null) {
            const search = query.trim().toLowerCase();
            return getApiResponse(200, "Hymns retrieved successfully.", hymns.filter((hymn) =>
                String(hymn.id).includes(search) || hymn.title.toLowerCase().includes(search)
            ));
        }
        return getApiResponse(200, "Hymns retrieved successfully.", hymns);
    } catch (error) {
        console.error("Failed to retrieve hymns:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The hymns could not be retrieved.",
            500
        );
    }
}

export async function getHymnById(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseHymnId((await params).id);
        if (id === null) {
            return getErrorResponse(
                "INVALID_HYMN_ID",
                "Hymn ID must be a positive whole number.",
                400
            );
        }
        const hymn = await findHymnById(id);
        if (!hymn) {
            return getErrorResponse(
                "HYMN_NOT_FOUND",
                "No hymn was found for that ID.",
                404
            );
        }
        return getApiResponse(200, "Hymn retrieved successfully.", hymn);
    } catch (error) {
        console.error("Failed to retrieve hymn:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The hymn could not be retrieved.",
            500
        );
    }
}

export async function createHymn(request: Request) {
    try {
        const body = await readJsonBody(request);
        if ("response" in body) {
            return body.response;
        }
        const parsed = HymnSchema.safeParse(body.data);
        if (!parsed.success) {
            return getErrorResponse(
                "INVALID_HYMN",
                "The hymn data is invalid.",
                400,
                parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            );
        }
        const existing = await findHymnByTitle(parsed.data.title);
        if (existing) {
            return getErrorResponse("HYMN_EXISTS", "A hymn already exists with that ID or title.", 409);
        }
        const hymn = await addHymn(parsed.data);
        return getApiResponse(201, "Hymn created successfully.", hymn);
    } catch (error) {
        if (isDuplicateError(error)) {
            return getErrorResponse(
                "HYMN_EXISTS",
                "A hymn already exists with that ID or title.",
                409
            );
        }
        console.error("Failed to create hymn:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The hymn could not be created.",
            500
        );
    }
}

export async function updateHymnById(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseHymnId((await params).id);
        if (id === null) {
            return getErrorResponse(
                "INVALID_HYMN_ID",
                "Hymn ID must be a positive whole number.",
                400
            );
        }
        const existing = await findHymnById(id);
        if (!existing) {
            return getErrorResponse(
                "HYMN_NOT_FOUND",
                "No hymn was found for that ID.",
                404
            );
        }
        const body = await readJsonBody(request);
        if ("response" in body) {
            return body.response;
        }
        const parsed = HymnSchema.safeParse(body.data);
        if (!parsed.success) {
            return getErrorResponse(
                "INVALID_HYMN",
                "The hymn data is invalid.",
                400,
                parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            );
        }
        if (parsed.data.id !== id) {
            return getErrorResponse("INVALID_HYMN", "The hymn ID must match the URL.", 400, [
                { field: "id", message: "The hymn ID cannot be changed." },
            ]);
        }
        const matchingTitle = await findHymnByTitle(parsed.data.title);
        if (matchingTitle && matchingTitle.id !== id) {
            return getErrorResponse("HYMN_EXISTS", "A hymn already exists with that ID or title.", 409);
        }
        const hymn = await editHymnById(id, parsed.data);
        if (!hymn) {
            return getErrorResponse("HYMN_NOT_FOUND", "No hymn was found for that ID.", 404);
        }
        return getApiResponse(200, "Hymn updated successfully.", hymn);
    } catch (error) {
        if (isDuplicateError(error)) {
            return getErrorResponse(
                "HYMN_EXISTS",
                "A hymn already exists with that ID or title.",
                409
            );
        }
        console.error("Failed to update hymn:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The hymn could not be updated.",
            500
        );
    }
}

export async function deleteHymnById(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseHymnId((await params).id);
        if (id === null) {
            return getErrorResponse(
                "INVALID_HYMN_ID",
                "Hymn ID must be a positive whole number.",
                400
            );
        }
        const existing = await findHymnById(id);
        if (!existing) {
            return getErrorResponse(
                "HYMN_NOT_FOUND",
                "No hymn was found for that ID.",
                404
            );
        }
        const hymn = await removeHymnById(id);
        if (!hymn) {
            return getErrorResponse("HYMN_IN_USE", "This hymn is used by a meeting and cannot be deleted.", 409);
        }
        return getApiResponse(200, "Hymn deleted successfully.", hymn);
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "23503") {
            return getErrorResponse("HYMN_IN_USE", "This hymn is used by a meeting and cannot be deleted.", 409);
        }
        console.error("Failed to delete hymn:", error);
        return getErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "The hymn could not be deleted.",
            500
        );
    }
}
