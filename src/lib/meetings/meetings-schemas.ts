/***** Imports *****/
import { z } from "zod";
import { isValidISODate } from "@/lib/meetings/meetings-validation";
import type {
    MeetingFormInput,
    MeetingFormState,
    SacramentMeeting,
    SpeakerItem,
} from "./meetings-types";

/***** Constants *****/
const MEETING_TYPES = ["testimony", "regular", "stake", "general"] as const;
const MEETING_FORM_FIELDS = new Set<string>([
    "date",
    "meeting_type",
    "presiding",
    "conducting",
    "announcements",
    "opening_hymn_number",
    "opening_hymn_title",
    "opening_prayer",
    "ward_business",
    "stake_business",
    "sacrament_hymn_number",
    "sacrament_hymn_title",
    "speakers",
    "closing_hymn_number",
    "closing_hymn_title",
    "closing_prayer",
]);

/***** Helper functions *****/
function isMeetingFormField(field: string): field is keyof MeetingFormInput {
    return MEETING_FORM_FIELDS.has(field);
}

function parseLines(value: string): string[] {
    return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
}

function parseSpeakers(value: string): SpeakerItem[] {
    return parseLines(value).map((line) => {
        const [name, topic, type] = line.split("|").map((part) => part.trim());
        let speakerType: SpeakerItem["type"] = "speaker";
        if (type === "musical-number") {
            speakerType = "musical-number";
        }
        return { name, topic, type: speakerType };
    });
}

/***** Schemas *****/
const hymnNumberSchema = z
    .string()
    .refine(
        (value) =>
            /^\d+$/.test(value) &&
            Number.isSafeInteger(Number(value)) &&
            Number(value) > 0,
        "Enter a positive whole hymn number.",
    )
    .transform(Number);

export const MeetingFormSchema = z
    .object({
        date: z.string().refine(isValidISODate, "Enter a valid meeting date."),
        meeting_type: z.enum(MEETING_TYPES, {
            error: "Select a valid meeting type.",
        }),
        presiding: z
            .string()
            .trim()
            .min(1, "Enter the presiding leader.")
            .max(255),
        conducting: z
            .string()
            .trim()
            .min(1, "Enter the conducting leader.")
            .max(255),
        announcements: z
            .string()
            .max(4000, "Announcements must be 4,000 characters or fewer.")
            .transform(parseLines),
        opening_hymn_number: hymnNumberSchema,
        opening_hymn_title: z
            .string()
            .trim()
            .min(1, "Enter the opening hymn title.")
            .max(255),
        opening_prayer: z
            .string()
            .trim()
            .min(1, "Enter the opening prayer.")
            .max(255),
        ward_business: z
            .string()
            .max(4000, "Ward business must be 4,000 characters or fewer.")
            .transform(parseLines)
            .transform((items) =>
                items.map((description) => ({ description }))
            ),
        stake_business: z.boolean(),
        sacrament_hymn_number: hymnNumberSchema,
        sacrament_hymn_title: z
            .string()
            .trim()
            .min(1, "Enter the sacrament hymn title.")
            .max(255),
        speakers: z
            .string()
            .max(6000, "Speaker entries must be 6,000 characters or fewer.")
            .superRefine((value, context) => {
                const lines = parseLines(value);
                if (lines.length > 30) {
                    context.addIssue({
                        code: "custom",
                        message:
                            "Enter no more than 30 speakers or musical numbers.",
                    });
                }
                lines.forEach((line, index) => {
                    const parts = line.split("|").map((part) => part.trim());
                    if (parts.length !== 3) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: use Name | Topic | speaker or musical-number.`,
                        });
                        return;
                    }
                    if (parts[0].length === 0) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: enter a name.`,
                        });
                    }
                    if (
                        parts[2] !== "speaker" &&
                        parts[2] !== "musical-number"
                    ) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: type must be speaker or musical-number.`,
                        });
                    }
                    if (parts[0].length > 255 || parts[1].length > 1000) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: name or topic is too long.`,
                        });
                    }
                });
            })
            .transform(parseSpeakers),
        closing_hymn_number: hymnNumberSchema,
        closing_hymn_title: z
            .string()
            .trim()
            .min(1, "Enter the closing hymn title.")
            .max(255),
        closing_prayer: z
            .string()
            .trim()
            .min(1, "Enter the closing prayer.")
            .max(255),
    })
    .transform(
        (fields): Omit<SacramentMeeting, "id"> => ({
            date: fields.date,
            meeting_type: fields.meeting_type,
            presiding: fields.presiding,
            conducting: fields.conducting,
            announcements: fields.announcements,
            opening_hymn: {
                number: fields.opening_hymn_number,
                title: fields.opening_hymn_title,
            },
            opening_prayer: fields.opening_prayer,
            ward_business: fields.ward_business,
            stake_business: fields.stake_business,
            sacrament_hymn: {
                number: fields.sacrament_hymn_number,
                title: fields.sacrament_hymn_title,
            },
            speakers: fields.speakers,
            closing_hymn: {
                number: fields.closing_hymn_number,
                title: fields.closing_hymn_title,
            },
            closing_prayer: fields.closing_prayer,
        })
    );

const HymnSchema = z.object({
    number: z.number().int().positive(),
    title: z.string().trim().min(1).max(255),
});

export const MeetingPayloadSchema = z.object({
    date: z.string().refine(isValidISODate, "Enter a valid meeting date."),
    meeting_type: z.enum(MEETING_TYPES),
    presiding: z.string().trim().min(1).max(255),
    conducting: z.string().trim().min(1).max(255),
    announcements: z.array(z.string()).default([]),
    opening_hymn: HymnSchema,
    opening_prayer: z.string().trim().min(1).max(255),
    ward_business: z.array(
        z.object({ description: z.string().trim().min(1).max(1000) })
    ),
    stake_business: z.boolean(),
    sacrament_hymn: HymnSchema,
    speakers: z.array(
        z.object({
            name: z.string().trim().min(1).max(255),
            topic: z.string().max(1000),
            type: z.enum(["speaker", "musical-number"]),
        })
    ),
    closing_hymn: HymnSchema,
    closing_prayer: z.string().trim().min(1).max(255),
}) satisfies z.ZodType<Omit<SacramentMeeting, "id">>;

/***** Form helpers *****/
function getFormString(formData: FormData, name: string): string {
    const value = formData.get(name);
    if (typeof value !== "string") {
        return "";
    }
    return value;
}

export function readMeetingForm(formData: FormData) {
    const raw: MeetingFormInput = {
        date: getFormString(formData, "date"),
        meeting_type: getFormString(formData, "meeting_type"),
        presiding: getFormString(formData, "presiding"),
        conducting: getFormString(formData, "conducting"),
        announcements: getFormString(formData, "announcements"),
        opening_hymn_number: getFormString(formData, "opening_hymn_number"),
        opening_hymn_title: getFormString(formData, "opening_hymn_title"),
        opening_prayer: getFormString(formData, "opening_prayer"),
        ward_business: getFormString(formData, "ward_business"),
        stake_business: formData.get("stake_business") === "on",
        sacrament_hymn_number: getFormString(formData, "sacrament_hymn_number"),
        sacrament_hymn_title: getFormString(formData, "sacrament_hymn_title"),
        speakers: getFormString(formData, "speakers"),
        closing_hymn_number: getFormString(formData, "closing_hymn_number"),
        closing_hymn_title: getFormString(formData, "closing_hymn_title"),
        closing_prayer: getFormString(formData, "closing_prayer"),
    };
    return MeetingFormSchema.safeParse(raw);
}

export function formatMeetingFormErrors(error: z.ZodError): MeetingFormState {
    const errors: MeetingFormState["errors"] = {};
    for (const issue of error.issues) {
        const field = issue.path[0];
        if (typeof field !== "string" || !isMeetingFormField(field)) {
            continue;
        }
        const fieldErrors = errors[field] ?? [];
        errors[field] = [...fieldErrors, issue.message];
    }

    return {
        message: "Please correct the highlighted fields.",
        errors,
    };
}
