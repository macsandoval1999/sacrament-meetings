// Create a type to represent the different types of meetings
// NOTE: A type is used to define a set of possible values for a variable.
export type MeetingType = "testimony" | "regular" | "stake" | "general";

// Create an interface to represent a hymn
// NOTE: An interface is used to define the shape of an object, specifying the properties and their types.
export interface Hymn {
    number: number;
    title: string;
}

// Create an interface to represent a speaker item
export interface SpeakerItem {
    name: string;
    topic: string;
    type: "speaker" | "musical-number";
}

// Create an interface to represent ward business items
export interface WardBusinessItem {
    description: string;
}

// Create an interface to represent a sacrament meeting
// NOTE: This interface combines all the elements that make up a sacrament meeting, including hymns, prayers, speakers, and business items.
// An easy way to remember it is think of it as a class with a bunch of foreign key references to other entities like hymns, prayers, speakers, and business items.
// The primary key for this interface is the 'id' property, which uniquely identifies each sacrament meeting.
export interface SacramentMeeting {
    id: number;
    date: string; // ISO date string: 'YYYY-MM-DD'
    meetingType: MeetingType;
    presiding: string;
    conducting: string;
    announcements?: string[];
    openingHymn: Hymn;
    openingPrayer: string;
    wardBusiness: WardBusinessItem[];
    stakeBusiness: boolean;
    sacramentHymn: Hymn;
    speakers: SpeakerItem[];
    closingHymn: Hymn;
    closingPrayer: string;
}
