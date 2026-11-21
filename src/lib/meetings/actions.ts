"use server";

/* NOTE:
    These Server Actions validate meeting form submissions, write meeting data
    through the database models, and refresh the meetings route after changes.
    Validation errors return to the forms; unexpected database failures reach
    the meetings error boundary.
*/

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createMeeting as createMeetingInDatabase,
    deleteMeeting as deleteMeetingFromDatabase,
    updateMeeting as updateMeetingInDatabase,
} from "@/lib/meetings/models/meetings-models";
import {
    formatMeetingFormErrors,
    readMeetingForm,
} from "@/lib/meetings/meetings-schemas";
import { parseMeetingId } from "@/lib/meetings/meetings-validation";
import type {
    MeetingFormState,
    SacramentMeeting,
} from "@/lib/meetings/meetings-types";

function refreshMeetings() {
    revalidatePath("/meetings", "layout");
}

export async function createMeeting(
    _previousState: MeetingFormState,
    formData: FormData
): Promise<MeetingFormState> {
    const parsed = readMeetingForm(formData);
    if (!parsed.success) {
        return formatMeetingFormErrors(parsed.error);
    }

    try {
        await createMeetingInDatabase(parsed.data);
    } catch (error) {
        console.error("Failed to create meeting:", error);
        throw new Error("Unable to create the meeting. Please try again.");
    }

    refreshMeetings();
    redirect("/meetings");
}

export async function updateMeeting(
    id: string,
    _previousState: MeetingFormState,
    formData: FormData
): Promise<MeetingFormState> {
    const meetingId = parseMeetingId(id);
    if (meetingId === null) {
        return { message: "The meeting ID is invalid.", errors: {} };
    }

    const parsed = readMeetingForm(formData);
    if (!parsed.success) {
        return formatMeetingFormErrors(parsed.error);
    }

    let updated: SacramentMeeting | null;
    try {
        updated = await updateMeetingInDatabase(meetingId, parsed.data);
    } catch (error) {
        console.error("Failed to update meeting:", error);
        throw new Error("Unable to update the meeting. Please try again.");
    }
    if (!updated) {
        return { message: "This meeting no longer exists.", errors: {} };
    }

    refreshMeetings();
    redirect("/meetings");
}

export async function deleteMeeting(id: string): Promise<void> {
    const meetingId = parseMeetingId(id);
    if (meetingId === null) {
        throw new Error("The meeting ID is invalid.");
    }

    let deleted: SacramentMeeting | null;
    try {
        deleted = await deleteMeetingFromDatabase(meetingId);
    } catch (error) {
        console.error("Failed to delete meeting:", error);
        throw new Error("Unable to delete the meeting. Please try again.");
    }
    if (!deleted) {
        throw new Error("This meeting no longer exists.");
    }

    refreshMeetings();
    redirect("/meetings");
}
