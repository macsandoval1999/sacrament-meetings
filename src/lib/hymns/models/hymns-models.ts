import { neon } from "@neondatabase/serverless";
import type { Hymn, HymnInput } from "../hymns-types";

const sql = neon(process.env.DATABASE_URL!);

export const ITEMS_PER_PAGE = 50;

export async function getAllHymns(): Promise<Hymn[]> {
    const hymns = await sql`
        SELECT id, title
        FROM hymns
        ORDER BY id ASC
    `;
    return hymns as unknown as Hymn[];
}

export async function getAllPaginatedHymns(
    query: string = "",
    currentPage: number = 1,
    limit: number = ITEMS_PER_PAGE
): Promise<Hymn[]> {
    const searchTerm = `%${query}%`;
    const offset = (currentPage - 1) * limit;
    const hymns = await sql`
        SELECT id, title
        FROM hymns
        WHERE id::text ILIKE ${searchTerm} OR title ILIKE ${searchTerm}
        ORDER BY id ASC
        LIMIT ${limit}
        OFFSET ${offset}
    `;
    return hymns as unknown as Hymn[];
}

export async function getHymnsCount(query: string = ""): Promise<number> {
    const searchTerm = `%${query}%`;
    const hymns = await sql`
        SELECT COUNT(*)
        FROM hymns
        WHERE id::text ILIKE ${searchTerm} OR title ILIKE ${searchTerm}
    `;
    return Number(hymns[0].count);
}

export async function getHymnById(id: number): Promise<Hymn | null> {
    const hymns = await sql`
        SELECT id, title
        FROM hymns
        WHERE id = ${id}
    `;
    if (!hymns[0]) {
        return null;
    }
    return hymns[0] as unknown as Hymn;
}

export async function getHymnByTitle(title: string): Promise<Hymn | null> {
    const hymns = await sql`
        SELECT id, title
        FROM hymns
        WHERE LOWER(title) = LOWER(${title.trim()})
    `;
    if (!hymns[0]) {
        return null;
    }
    return hymns[0] as unknown as Hymn;
}

export async function createHymn(input: HymnInput): Promise<Hymn> {
    const hymns = await sql`
        INSERT INTO hymns (id, title)
        VALUES (${input.id}, ${input.title})
        RETURNING id, title
    `;
    if (!hymns[0]) {
        throw new Error("The created hymn was not returned by the database.");
    }
    return hymns[0] as unknown as Hymn;
}

export async function updateHymnById(
    id: number,
    input: HymnInput
): Promise<Hymn | null> {
    const hymns = await sql`
        UPDATE hymns
        SET title = ${input.title}
        WHERE id = ${id}
        RETURNING id, title
    `;
    if (!hymns[0]) {
        return null;
    }
    return hymns[0] as unknown as Hymn;
}

export async function deleteHymnById(id: number): Promise<Hymn | null> {
    const hymns = await sql`
        DELETE FROM hymns
        WHERE id = ${id}
        AND NOT EXISTS (
            SELECT 1 FROM sacrament_meetings
            WHERE ${id} = ANY(musical_number_ids)
        )
        RETURNING id, title
    `;
    if (!hymns[0]) {
        return null;
    }
    return hymns[0] as unknown as Hymn;
}
