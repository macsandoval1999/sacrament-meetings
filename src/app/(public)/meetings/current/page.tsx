import CurrentMeeting from "@/components/meetings/CurrentMeeting";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "This Sunday's Meeting",
    description:
        "View this Sunday's sacrament meeting agenda, hymns, speakers, and announcements.",
};

export default function CurrentMeetingPage() {
    return <CurrentMeeting />;
}
