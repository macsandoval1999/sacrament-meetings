// First we import the SacramentMeeting type to ensure our meetings array adheres to the correct structure.
import type {
    MeetingRecord,
    SacramentMeeting,
} from "../meetings-types";
import { getAllHymns } from "@/lib/hymns/models/hymns-models";
import { formatMeeting } from "@/lib/helpers";
// We also import the neon database client for serverless database interactions. This allows us to interact with the database in a serverless environment. The way it works is by providing a lightweight client that can be used in serverless functions to query the database efficiently.
import { neon } from "@neondatabase/serverless";

// Initialize the SQL client using the Neon database URL from environment variables. This client will be used to execute queries against the database.
const sql = neon(process.env.DATABASE_URL!);
// Define the number of items to display per page for pagination purposes. This constant will be used when querying the database to limit the number of results returned per page.
export const ITEMS_PER_PAGE = 6;

// GET ALL PAGINATED: get meetings with pagination and optional search query.
// Takes an optional search query and the current page number,
// and returns a paginated list of meetings matching the search criteria.
export async function getPaginatedMeetings(
    query: string = "",
    currentPage: number = 1,
    limit: number = ITEMS_PER_PAGE
): Promise<SacramentMeeting[]> {
    const searchTerm = `%${query}%`;
    const offset = (currentPage - 1) * limit;

    const meetings = await sql`
        SELECT
            id, to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type, presiding, conducting, announcements,
            opening_hymn_id, opening_prayer, ward_business, stake_business,
            sacrament_hymn_id, intermediate_hymn_id, musical_number_ids,
            speakers, closing_hymn_id, closing_prayer
        FROM sacrament_meetings
        WHERE
            COALESCE(date::text, '') ILIKE ${searchTerm}
            OR COALESCE(to_char(date, 'FMMonth YYYY'), '') ILIKE ${searchTerm}
            OR COALESCE(meeting_type::text, '') ILIKE ${searchTerm}
            OR COALESCE(presiding, '') ILIKE ${searchTerm}
            OR COALESCE(conducting, '') ILIKE ${searchTerm}
            OR COALESCE(announcements::text, '') ILIKE ${searchTerm}
            OR EXISTS (
                SELECT id FROM hymns
                WHERE (
                    id IN (opening_hymn_id, sacrament_hymn_id, intermediate_hymn_id, closing_hymn_id)
                    OR id = ANY(COALESCE(musical_number_ids, '{}'::integer[]))
                )
                AND (id::text ILIKE ${searchTerm} OR title ILIKE ${searchTerm})
            )
            OR COALESCE(opening_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(closing_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(ward_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(stake_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(speakers::text, '') ILIKE ${searchTerm}
        ORDER BY date DESC
        LIMIT ${limit}
        OFFSET ${offset}
    `;
    if (meetings.length === 0) {
        return [];
    }
    const hymns = await getAllHymns();
    return (meetings as unknown as MeetingRecord[]).map((meeting) => formatMeeting(meeting, hymns));
}

// GET TOTAL COUNT: count meetings matching the search query.
export async function getMeetingsCount(query: string = ""): Promise<number> {
    const searchTerm = `%${query}%`;
    const meetings = await sql`
        SELECT COUNT(*)
        FROM sacrament_meetings
        WHERE
            COALESCE(date::text, '') ILIKE ${searchTerm}
            OR COALESCE(to_char(date, 'FMMonth YYYY'), '') ILIKE ${searchTerm}
            OR COALESCE(meeting_type::text, '') ILIKE ${searchTerm}
            OR COALESCE(presiding, '') ILIKE ${searchTerm}
            OR COALESCE(conducting, '') ILIKE ${searchTerm}
            OR COALESCE(announcements::text, '') ILIKE ${searchTerm}
            OR EXISTS (
                SELECT id FROM hymns
                WHERE (
                    id IN (opening_hymn_id, sacrament_hymn_id, intermediate_hymn_id, closing_hymn_id)
                    OR id = ANY(COALESCE(musical_number_ids, '{}'::integer[]))
                )
                AND (id::text ILIKE ${searchTerm} OR title ILIKE ${searchTerm})
            )
            OR COALESCE(opening_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(closing_prayer, '') ILIKE ${searchTerm}
            OR COALESCE(ward_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(stake_business::text, '') ILIKE ${searchTerm}
            OR COALESCE(speakers::text, '') ILIKE ${searchTerm}
    `;

    return Number(meetings[0].count);
}

// GET BY ID: get one meeting by its ID
export async function getMeetingById(
    id: number
): Promise<SacramentMeeting | null> {
    const meeting = await sql`
        SELECT
            id, to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type, presiding, conducting, announcements,
            opening_hymn_id, opening_prayer, ward_business, stake_business,
            sacrament_hymn_id, intermediate_hymn_id, musical_number_ids,
            speakers, closing_hymn_id, closing_prayer
        FROM sacrament_meetings
        WHERE id = ${id}
    `;

    if (!meeting[0]) return null;

    const hymns = await getAllHymns();
    return formatMeeting(meeting[0] as unknown as MeetingRecord, hymns);
}

// GET by DATE: get one meeting by its date
export async function getMeetingByDate(
    date: string
): Promise<SacramentMeeting | null> {
    const meeting = await sql`
        SELECT
            id, to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type, presiding, conducting, announcements,
            opening_hymn_id, opening_prayer, ward_business, stake_business,
            sacrament_hymn_id, intermediate_hymn_id, musical_number_ids,
            speakers, closing_hymn_id, closing_prayer
        FROM sacrament_meetings
        WHERE date = ${date}
    `;

    if (!meeting[0]) return null;

    const hymns = await getAllHymns();
    return formatMeeting(meeting[0] as unknown as MeetingRecord, hymns);
}

export async function createMeeting(
    meeting: Omit<MeetingRecord, "id">
): Promise<SacramentMeeting> {
    const created = await sql`
        INSERT INTO sacrament_meetings (
            date, meeting_type, presiding, conducting, announcements,
            opening_hymn_id, opening_prayer, ward_business, stake_business,
            sacrament_hymn_id, intermediate_hymn_id, musical_number_ids,
            speakers, closing_hymn_id, closing_prayer
        )
        VALUES (
            ${meeting.date}::date,
            ${meeting.meeting_type},
            ${meeting.presiding},
            ${meeting.conducting},
            ${meeting.announcements ?? []}::text[],
            ${meeting.opening_hymn_id},
            ${meeting.opening_prayer},
            ${JSON.stringify(meeting.ward_business)}::jsonb,
            ${meeting.stake_business},
            ${meeting.sacrament_hymn_id},
            ${meeting.intermediate_hymn_id},
            ${meeting.musical_number_ids}::integer[],
            ${JSON.stringify(meeting.speakers)}::jsonb,
            ${meeting.closing_hymn_id},
            ${meeting.closing_prayer}
        )
        RETURNING id
    `;
    if (!created[0]) {
        throw new Error("The created meeting was not returned by the database.");
    }
    const meetingCreated = await getMeetingById(created[0].id as number);
    if (!meetingCreated) {
        throw new Error("The created meeting could not be retrieved.");
    }
    return meetingCreated;
}

export async function updateMeeting(
    id: number,
    meeting: Omit<MeetingRecord, "id">
): Promise<SacramentMeeting | null> {
    const updated = await sql`
        UPDATE sacrament_meetings
        SET
            date = ${meeting.date}::date,
            meeting_type = ${meeting.meeting_type},
            presiding = ${meeting.presiding},
            conducting = ${meeting.conducting},
            announcements = ${meeting.announcements ?? []}::text[],
            opening_hymn_id = ${meeting.opening_hymn_id},
            opening_prayer = ${meeting.opening_prayer},
            ward_business = ${JSON.stringify(meeting.ward_business)}::jsonb,
            stake_business = ${meeting.stake_business},
            sacrament_hymn_id = ${meeting.sacrament_hymn_id},
            intermediate_hymn_id = ${meeting.intermediate_hymn_id},
            musical_number_ids = ${meeting.musical_number_ids}::integer[],
            speakers = ${JSON.stringify(meeting.speakers)}::jsonb,
            closing_hymn_id = ${meeting.closing_hymn_id},
            closing_prayer = ${meeting.closing_prayer}
        WHERE id = ${id}
        RETURNING id
    `;
    if (!updated[0]) return null;
    return getMeetingById(updated[0].id as number);
}

export async function deleteMeeting(
    id: number
): Promise<SacramentMeeting | null> {
    const meeting = await getMeetingById(id);
    if (!meeting) {
        return null;
    }
    const deleted = await sql`
        DELETE FROM sacrament_meetings
        WHERE id = ${id}
        RETURNING id
    `;
    if (!deleted[0]) return null;
    return meeting;
}
