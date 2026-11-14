// First we import the SacramentMeeting type to ensure our meetings array adheres to the correct structure.
import type { SacramentMeeting } from "../types/meetings-types";

const meetings: SacramentMeeting[] = [
    {
        id: 1,
        date: "2026-11-01",
        meeting_type: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Jones",
        opening_hymn: { number: 2, title: "The Spirit of God" },
        opening_prayer: "Sister Williams",
        ward_business: [{ description: "Sustaininag of new Primary president" }],
        stake_business: false,
        sacrament_hymn: {
            number: 169,
            title: "In Remembrance of Thy Suffering",
        },
        speakers: [
            {
                name: "Sister Brown",
                topic: "Faith in Jesus Christ",
                type: "speaker",
            },
            { name: "Youth Choir", topic: "", type: "musical-number" },
        ],
        closing_hymn: { number: 31, title: "O God, Our Help in Ages Past" },
        closing_prayer: "Brother Davis",
        announcements: ["Ward temple night: May 10"],
    },
    {
        id: 2,
        date: "2026-11-08",
        meeting_type: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Johnson",
        opening_hymn: { number: 3, title: "Now Let Us Rejoice" },
        opening_prayer: "Brother Thompson",
        ward_business: [
            { description: "Discussion on upcoming ward activities" },
        ],
        stake_business: false,
        sacrament_hymn: {
            number: 170,
            title: "Jesus, Once of Humble Birth",
        },
        speakers: [
            {
                name: "Brother White",
                topic: "Charity and Service",
                type: "speaker",
            },
            { name: "Ward Choir", topic: "", type: "musical-number" },
        ],
        closing_hymn: { number: 34, title: "Come, Ye Thankful People, Come" },
        closing_prayer: "Sister Green",
        announcements: ["Ward service project: May 15"],
    },
    {
        id: 3,
        date: "2026-11-15",
        meeting_type: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Williams",
        opening_hymn: {
            number: 4,
            title: "Come, Let Us Sing of a Wonderful Love",
        },
        opening_prayer: "Brother Brown",
        ward_business: [{ description: "Planning for ward picnic" }],
        stake_business: false,
        sacrament_hymn: {
            number: 171,
            title: "While of These Emblems We Partake",
        },
        speakers: [
            {
                name: "Sister Taylor",
                topic: "The Importance of Prayer",
                type: "speaker",
            },
            { name: "Ward Choir", topic: "", type: "musical-number" },
        ],
        closing_hymn: { number: 35, title: "The Lord Is My Shepherd" },
        closing_prayer: "Brother Johnson",
        announcements: ["Ward youth activity: May 20"],
    },
    {
        id: 4,
        date: "2026-11-22",
        meeting_type: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Davis",
        opening_hymn: { number: 5, title: "Come, Follow Me" },
        opening_prayer: "Sister White",
        ward_business: [{ description: "Discussion on ward budget" }],
        stake_business: false,
        sacrament_hymn: {
            number: 172,
            title: "As Now We Take the Sacrament",
        },
        speakers: [
            {
                name: "Brother Green",
                topic: "Faith and Obedience",
                type: "speaker",
            },
            { name: "Ward Choir", topic: "", type: "musical-number" },
        ],
        closing_hymn: {
            number: 36,
            title: "God Be with You Till We Meet Again",
        },
        closing_prayer: "Brother Johnson",
        announcements: ["Ward service project: May 25"],
    },
    {
        id: 5,
        date: "2026-11-29",
        meeting_type: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Miller",
        opening_hymn: { number: 6, title: "Come, Follow Me" },
        opening_prayer: "Sister Brown",
        ward_business: [{ description: "Discussion on ward activities" }],
        stake_business: false,
        sacrament_hymn: {
            number: 173,
            title: "We Meet Again as Sisters and Brothers",
        },
        speakers: [
            {
                name: "Brother White",
                topic: "Charity and Service",
                type: "speaker",
            },
            { name: "Ward Choir", topic: "", type: "musical-number" },
        ],
        closing_hymn: { number: 37, title: "Now Let Us Rejoice" },
        closing_prayer: "Brother Davis",
        announcements: ["Ward service project: May 30"],
    },
];

// GET ALL: get all meetings
// GET ALL by date: get all meetings filtered by date if provided.
export function getAllMeetings(date?: string | null): SacramentMeeting[] {
    if (date) return meetings.filter((meeting) => meeting.date === date);
    return meetings;
}

// GET by ID: get one meeting by its ID
export function getMeetingById(id: number): SacramentMeeting | null {
    return meetings.find((meeting) => meeting.id === id) ?? null;
}

// GET by DATE: get one meeting by its date
export function getMeetingByDate(date: string): SacramentMeeting | null {
    return meetings.find((meeting) => meeting.date === date) ?? null;
}
