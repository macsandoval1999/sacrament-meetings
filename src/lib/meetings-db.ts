// First we import the SacramentMeeting type to ensure our meetings array adheres to the correct structure.
import type { SacramentMeeting } from "../types/meetings-types";
// We also import the neon database client for serverless database interactions. This allows us to interact with the database in a serverless environment. The way it works is by providing a lightweight client that can be used in serverless functions to query the database efficiently.
import { neon } from "@neondatabase/serverless";



// Initialize the SQL client using the Neon database URL from environment variables. This client will be used to execute queries against the database.
const sql = neon(process.env.DATABASE_URL!);
// Define the number of items to display per page for pagination purposes. This constant will be used when querying the database to limit the number of results returned per page.
const ITEMS_PER_PAGE = 6;



// GET ALL PAGINATED: get meetings with pagination and optional search query.
// Takes an optional search query and the current page number,
// and returns a paginated list of meetings matching the search criteria.
export async function getPaginatedMeetings(query: string = '', currentPage: number = 1): Promise<SacramentMeeting[]> {
    const searchTerm = `%${query}%`;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const meetings = await sql`
        SELECT
            id,
            to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type,
            presiding, conducting, announcements,
            opening_hymn,
            sacrament_hymn,
            closing_hymn,
            opening_prayer,
            closing_prayer,
            ward_business,
            stake_business,
            speakers
        FROM sacrament_meetings
        WHERE
            COALESCE(date::text, '') ILIKE ${searchTerm}
            OR COALESCE(meeting_type::text, '') ILIKE ${searchTerm}
            OR COALESCE(presiding, '') ILIKE ${searchTerm}
            OR COALESCE(conducting, '') ILIKE ${searchTerm}
            OR COALESCE(announcements::text, '') ILIKE ${searchTerm}
            OR COALESCE(opening_hymn::text, '') ILIKE ${searchTerm}
            OR COALESCE(sacrament_hymn::text, '') ILIKE ${searchTerm}
            OR COALESCE(closing_hymn::text, '') ILIKE ${searchTerm}
            OR COALESCE(opening_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(closing_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(ward_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(stake_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(speakers::text, '') ILIKE ${searchTerm}
        ORDER BY date DESC
        LIMIT ${ITEMS_PER_PAGE}
        OFFSET ${offset}
    `;
    return meetings as unknown as SacramentMeeting[];
}

// GET TOTAL PAGES: get the total number of pages for paginated meetings based on the search query.
export async function getMeetingsTotalPages(query: string = ''): Promise<number> {
    const searchTerm = `%${query}%`;
    const meetings = await sql`
        SELECT COUNT(*)
        FROM sacrament_meetings
        WHERE
            COALESCE(date::text, '') ILIKE ${searchTerm}
            OR COALESCE(meeting_type::text, '') ILIKE ${searchTerm}
            OR COALESCE(presiding, '') ILIKE ${searchTerm}
            OR COALESCE(conducting, '') ILIKE ${searchTerm}
            OR COALESCE(announcements::text, '') ILIKE ${searchTerm}
            OR COALESCE(opening_hymn::text, '') ILIKE ${searchTerm}
            OR COALESCE(sacrament_hymn::text, '') ILIKE ${searchTerm}
            OR COALESCE(closing_hymn::text, '') ILIKE ${searchTerm}
            OR COALESCE(opening_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(closing_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(ward_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(stake_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(speakers::text, '') ILIKE ${searchTerm}
    `;

    const totalMeetingsPages = Math.ceil(Number(meetings[0]?.count ?? 0) / ITEMS_PER_PAGE);
    return totalMeetingsPages;
}

// GET BY ID: get one meeting by its ID
export async function getMeetingById(id: number, date?: string): Promise<SacramentMeeting | null> {
    const meeting = await sql`
        SELECT
            id,
            to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type,
            presiding, conducting, announcements,
            opening_hymn,
            sacrament_hymn,
            closing_hymn,
            opening_prayer,
            closing_prayer,
            ward_business,
            stake_business,
            speakers
        FROM sacrament_meetings
        WHERE id = ${id}
        OR date = ${date}
    `;

    if (!meeting[0])
        return null;

    return meeting[0] as unknown as SacramentMeeting;
}

// GET by DATE: get one meeting by its date
export async function getMeetingByDate(date: string): Promise<SacramentMeeting | null> {
    const meeting = await sql`
        SELECT
            id,
            to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type,
            presiding, conducting, announcements,
            opening_hymn,
            sacrament_hymn,
            closing_hymn,
            opening_prayer,
            closing_prayer,
            ward_business,
            stake_business,
            speakers
        FROM sacrament_meetings
        WHERE date = ${date}
    `;

    if (!meeting[0])
        return null;

    return meeting[0] as unknown as SacramentMeeting;
}

// export async function addMeeting(
//   data: Omit<SacramentMeeting, 'id'>
// ): Promise<SacramentMeeting> {
//   throw new Error('addMeeting: database implementation coming in Week 04');
// }

// export async function updateMeeting(
//   id: number,
//   updates: Partial<SacramentMeeting>
// ): Promise<SacramentMeeting | null> {
//   throw new Error('updateMeeting: database implementation coming in Week 04');
// }

// export async function deleteMeeting(id: number): Promise<boolean> {
//   throw new Error('deleteMeeting: database implementation coming in Week 04');
// }