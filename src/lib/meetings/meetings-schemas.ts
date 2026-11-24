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
const MEETING_TYPES = ["testimony", "regular", "stake", "general"] as const satisfies readonly SacramentMeeting["meeting_type"][];
const MEETING_FORM_FIELDS = new Set<string>([
    "date",
    "meeting_type",
    "presiding",
    "conducting",
    "announcements",
    "opening_hymn_id",
    "opening_prayer",
    "ward_business",
    "stake_business",
    "sacrament_hymn_id",
    "intermediate_hymn_id",
    "musical_number_ids",
    "speakers",
    "closing_hymn_id",
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

function parseSpeakerItems(value: string): SpeakerItem[] {
    return parseLines(value).map((line) => {
        const parts = line.split("|").map((part) => part.trim());
        return {
            name: parts[0] ?? "",
            topic: parts[1] ?? "",
        };
    });
}

/***** Schemas *****/
const hymnIdSchema = z
    .string()
    .refine(
        (value) =>
            /^\d+$/.test(value) &&
            Number.isSafeInteger(Number(value)) &&
            Number(value) > 0 &&
            Number(value) <= 2147483647,
        "Select a hymn.",
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
        opening_hymn_id: hymnIdSchema,
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
        sacrament_hymn_id: hymnIdSchema,
        intermediate_hymn_id: z.union([
            z.literal("").transform(() => null),
            hymnIdSchema,
        ]),
        musical_number_ids: z
            .string()
            .max(4000, "Musical hymn entries must be 4,000 characters or fewer.")
            .superRefine((value, context) => {
                const lines = parseLines(value);
                if (lines.length > 30) {
                    context.addIssue({ code: "custom", message: "Enter no more than 30 musical hymns." });
                }
                lines.forEach((line, index) => {
                    if (!hymnIdSchema.safeParse(line).success) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: enter a valid hymn number.`,
                        });
                    }
                });
            })
            .transform((value) => parseLines(value).map(Number)),
        speakers: z
            .string()
            .max(6000, "Speaker entries must be 6,000 characters or fewer.")
            .superRefine((value, context) => {
                const lines = parseLines(value);
                if (lines.length > 30) {
                    context.addIssue({
                        code: "custom",
                        message: "Enter no more than 30 items.",
                    });
                }
                lines.forEach((line, index) => {
                    const parts = line.split("|").map((part) => part.trim());
                    if (parts.length > 2) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: use Name or Name | Topic.`,
                        });
                    }
                    if (!parts[0]) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: enter a name.`,
                        });
                    }
                    if (
                        parts[0].length > 255 ||
                        (parts[1]?.length ?? 0) > 1000
                    ) {
                        context.addIssue({
                            code: "custom",
                            message: `Line ${index + 1}: name or topic/description is too long.`,
                        });
                    }
                });
            })
            .transform(parseSpeakerItems),
        closing_hymn_id: hymnIdSchema,
        closing_prayer: z
            .string()
            .trim()
            .min(1, "Enter the closing prayer.")
            .max(255),
    })
    .transform(
        (fields) => ({
            date: fields.date,
            meeting_type: fields.meeting_type,
            presiding: fields.presiding,
            conducting: fields.conducting,
            announcements: fields.announcements,
            opening_hymn_id: fields.opening_hymn_id,
            opening_prayer: fields.opening_prayer,
            ward_business: fields.ward_business,
            stake_business: fields.stake_business,
            sacrament_hymn_id: fields.sacrament_hymn_id,
            intermediate_hymn_id: fields.intermediate_hymn_id,
            musical_number_ids: fields.musical_number_ids,
            speakers: fields.speakers,
            closing_hymn_id: fields.closing_hymn_id,
            closing_prayer: fields.closing_prayer,
        })
    );

export const MeetingPayloadSchema = z.object({
    date: z.string().refine(isValidISODate, "Enter a valid meeting date."),
    meeting_type: z.enum(MEETING_TYPES),
    presiding: z.string().trim().min(1).max(255),
    conducting: z.string().trim().min(1).max(255),
    announcements: z.array(z.string()).default([]),
    opening_hymn_id: z.number().int().positive().max(2147483647),
    opening_prayer: z.string().trim().min(1).max(255),
    ward_business: z.array(
        z.object({ description: z.string().trim().min(1).max(1000) })
    ),
    stake_business: z.boolean(),
    sacrament_hymn_id: z.number().int().positive().max(2147483647),
    intermediate_hymn_id: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .nullable()
        .optional()
        .transform((value) => value ?? null),
    musical_number_ids: z.array(z.number().int().positive().max(2147483647)).max(30).default([]),
    speakers: z.array(
        z.object({
            name: z.string().trim().min(1).max(255),
            topic: z.string().max(1000),
        })
    ),
    closing_hymn_id: z.number().int().positive().max(2147483647),
    closing_prayer: z.string().trim().min(1).max(255),
});

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
        opening_hymn_id: getFormString(formData, "opening_hymn_id"),
        opening_prayer: getFormString(formData, "opening_prayer"),
        ward_business: getFormString(formData, "ward_business"),
        stake_business: formData.get("stake_business") === "on",
        sacrament_hymn_id: getFormString(formData, "sacrament_hymn_id"),
        intermediate_hymn_id: getFormString(formData, "intermediate_hymn_id"),
        musical_number_ids: getFormString(formData, "musical_number_ids"),
        speakers: getFormString(formData, "speakers"),
        closing_hymn_id: getFormString(formData, "closing_hymn_id"),
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
