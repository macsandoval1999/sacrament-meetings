// Create a type to represent the different types of meetings
// NOTE: A type is used to define a set of possible values for a variable.
import type { Hymn } from "@/lib/hymns/hymns-types";

export type MeetingType = "testimony" | "regular" | "stake" | "general";

// Create an interface to represent a speaker item
export interface SpeakerItem {
    name: string;
    topic: string;
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
    meeting_type: MeetingType;
    presiding: string;
    conducting: string;
    announcements?: string[];
    opening_hymn: Hymn;
    opening_prayer: string;
    ward_business: WardBusinessItem[];
    stake_business: boolean;
    sacrament_hymn: Hymn;
    intermediate_hymn?: Hymn | null;
    musical_numbers?: Hymn[];
    speakers: SpeakerItem[];
    closing_hymn: Hymn;
    closing_prayer: string;
}

// Database rows store hymn IDs; the API and UI use the corresponding hymns.
export interface MeetingRecord extends Omit<
    SacramentMeeting,
    "opening_hymn" | "sacrament_hymn" | "intermediate_hymn" | "musical_numbers" | "closing_hymn"
> {
    opening_hymn_id: number;
    sacrament_hymn_id: number;
    intermediate_hymn_id: number | null;
    musical_number_ids: number[];
    closing_hymn_id: number;
}

export interface MeetingFormInput {
    date: string;
    meeting_type: string;
    presiding: string;
    conducting: string;
    announcements: string;
    opening_hymn_id: string;
    opening_prayer: string;
    ward_business: string;
    stake_business: boolean;
    sacrament_hymn_id: string;
    intermediate_hymn_id: string;
    musical_number_ids: string;
    speakers: string;
    closing_hymn_id: string;
    closing_prayer: string;
}

export interface MeetingFormState {
    message: string;
    errors: Partial<Record<keyof MeetingFormInput, string[]>>;
}

