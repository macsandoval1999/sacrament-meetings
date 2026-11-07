// First we import the SacramentMeeting type to ensure our meetings array adheres to the correct structure.
import type { SacramentMeeting } from "../types/meeting-types";

const meetings: SacramentMeeting[] = [
    {
        id: 1,
        date: "2026-05-03",
        meetingType: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Jones",
        openingHymn: { number: 2, title: "The Spirit of God" },
        openingPrayer: "Sister Williams",
        wardBusiness: [{ description: "Sustaininag of new Primary president" }],
        stakeBusiness: false,
        sacramentHymn: {
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
        closingHymn: { number: 31, title: "O God, Our Help in Ages Past" },
        closingPrayer: "Brother Davis",
        announcements: ["Ward temple night: May 10"],
    },
    {
        id: 2,
        date: "2026-05-10",
        meetingType: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Johnson",
        openingHymn: { number: 3, title: "Now Let Us Rejoice" },
        openingPrayer: "Brother Thompson",
        wardBusiness: [{ description: "Discussion on upcoming ward activities" }],
        stakeBusiness: false,
        sacramentHymn: {
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
        closingHymn: { number: 34, title: "Come, Ye Thankful People, Come" },
        closingPrayer: "Sister Green",
        announcements: ["Ward service project: May 15"],
    },
    {
        id: 3,
        date: "2026-05-17",
        meetingType: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Williams",
        openingHymn: { number: 4, title: "Come, Let Us Sing of a Wonderful Love" },
        openingPrayer: "Brother Brown",
        wardBusiness: [{ description: "Planning for ward picnic" }],
        stakeBusiness: false,
        sacramentHymn: {
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
        closingHymn: { number: 35, title: "The Lord Is My Shepherd" },
        closingPrayer: "Brother Johnson",
        announcements: ["Ward youth activity: May 20"],
    },
    {
        id: 4,
        date: "2026-05-24",
        meetingType: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Davis",
        openingHymn: { number: 5, title: "Come, Follow Me" },
        openingPrayer: "Sister White",
        wardBusiness: [{ description: "Discussion on ward budget" }],
        stakeBusiness: false,
        sacramentHymn: {
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
        closingHymn: { number: 36, title: "God Be with You Till We Meet Again" },
        closingPrayer: "Brother Johnson",
        announcements: ["Ward service project: May 25"],    
    }, 
    {
        id: 5,
        date: "2026-05-31",
        meetingType: "regular",
        presiding: "Bishop Smith",
        conducting: "Brother Miller",
        openingHymn: { number: 6, title: "Come, Follow Me" },
        openingPrayer: "Sister Brown",
        wardBusiness: [{ description: "Discussion on ward activities" }],
        stakeBusiness: false,
        sacramentHymn: {
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
        closingHymn: { number: 37, title: "Now Let Us Rejoice" },
        closingPrayer: "Brother Davis",
        announcements: ["Ward service project: May 30"],    
    }
];

// GET ALL: get all meetings, optionally filtered by date
export function getAllMeetings(date?: string | null): SacramentMeeting[] {
    if (date) return meetings.filter((meeting) => meeting.date === date);
    return meetings;
}

// GET by ID: get one meeting by its ID
export function getMeetingById(id: number): SacramentMeeting | null {
    return meetings.find((meeting) => meeting.id === id) ?? null;
}
