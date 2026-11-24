/* NOTE:
    This client component renders the create and edit meeting forms.
    useActionState submits the values to a Server Action and displays its
    field-level validation messages in polite live regions.
*/

"use client";

import { useActionState } from "react";
import Link from "next/link";
import type {
    MeetingFormInput,
    MeetingFormState,
    SacramentMeeting,
} from "@/lib/meetings/meetings-types";
import type { Hymn } from "@/lib/hymns/hymns-types";

interface MeetingFormProps {
    action: (
        state: MeetingFormState,
        formData: FormData
    ) => Promise<MeetingFormState>;
    meeting?: SacramentMeeting;
    hymns: Hymn[];
}

const initialState: MeetingFormState = { message: "", errors: {} };
const fieldClassName =
    "mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const labelClassName = "block font-semibold text-foreground";
const errorClassName = "mt-1 min-h-5 text-sm text-red-200";

function getInitialValues(meeting?: SacramentMeeting): MeetingFormInput {
    if (!meeting) {
        return {
            date: "",
            meeting_type: "regular",
            presiding: "",
            conducting: "",
            announcements: "",
            opening_hymn_id: "",
            opening_prayer: "",
            ward_business: "",
            stake_business: false,
            sacrament_hymn_id: "",
            intermediate_hymn_id: "",
            musical_number_ids: "",
            speakers: "",
            closing_hymn_id: "",
            closing_prayer: "",
        };
    }

    let intermediateHymnId = "";
    if (meeting.intermediate_hymn) {
        intermediateHymnId = String(meeting.intermediate_hymn.id);
    }
    const speakerLines: string[] = [];
    for (const item of meeting.speakers) {
        if (item.topic) {
            speakerLines.push(`${item.name} | ${item.topic}`);
        } else {
            speakerLines.push(item.name);
        }
    }
    return {
        date: meeting.date,
        meeting_type: meeting.meeting_type,
        presiding: meeting.presiding,
        conducting: meeting.conducting,
        announcements: (meeting.announcements ?? []).join("\n"),
        opening_hymn_id: String(meeting.opening_hymn.id),
        opening_prayer: meeting.opening_prayer,
        ward_business: meeting.ward_business
            .map((item) => item.description)
            .join("\n"),
        stake_business: meeting.stake_business,
        sacrament_hymn_id: String(meeting.sacrament_hymn.id),
        intermediate_hymn_id: intermediateHymnId,
        musical_number_ids: (meeting.musical_numbers ?? []).map((hymn) => String(hymn.id)).join("\n"),
        speakers: speakerLines.join("\n"),
        closing_hymn_id: String(meeting.closing_hymn.id),
        closing_prayer: meeting.closing_prayer,
    };
}

function FieldError({
    field,
    errors,
}: {
    field: keyof MeetingFormInput;
    errors: MeetingFormState["errors"];
}) {
    let message = "";
    const fieldErrors = errors[field];
    if (fieldErrors && fieldErrors.length > 0) {
        message = fieldErrors.join(" ");
    }
    return (
        <p
            id={`${field}-error`}
            aria-live="polite"
            aria-atomic="true"
            className={errorClassName}
        >
            {message}
        </p>
    );
}

export default function MeetingForm({ action, meeting, hymns }: MeetingFormProps) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const values = getInitialValues(meeting);

    function getFieldErrorProps(
        field: keyof MeetingFormInput,
        helpId?: string
    ) {
        const describedBy = [`${field}-error`];
        if (helpId) {
            describedBy.unshift(helpId);
        }
        const props: {
            "aria-describedby": string;
            "aria-invalid"?: true;
        } = { "aria-describedby": describedBy.join(" ") };
        const errors = state.errors[field];
        if (errors && errors.length > 0) {
            props["aria-invalid"] = true;
        }
        return props;
    }

    let submitLabel = "Create meeting";
    if (meeting) {
        submitLabel = "Save changes";
    }
    if (pending) {
        submitLabel = "Saving...";
    }

    return (
        <form
            action={formAction}
            noValidate
            className="max-w-3xl space-y-5 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
            <p
                aria-live="polite"
                aria-atomic="true"
                className="text-sm text-red-200"
            >
                {state.message}
            </p>

            <div>
                <label className={labelClassName} htmlFor="date">
                    Meeting date
                </label>
                <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={values.date}
                    className={fieldClassName}
                    {...getFieldErrorProps("date")}
                />
                <FieldError field="date" errors={state.errors} />
            </div>

            <div>
                <label className={labelClassName} htmlFor="meeting_type">
                    Meeting type
                </label>
                <select
                    id="meeting_type"
                    name="meeting_type"
                    required
                    defaultValue={values.meeting_type}
                    className={fieldClassName}
                    {...getFieldErrorProps("meeting_type")}
                >
                    <option value="regular">Regular</option>
                    <option value="testimony">Testimony</option>
                    <option value="stake">Stake</option>
                    <option value="general">General</option>
                </select>
                <FieldError field="meeting_type" errors={state.errors} />
            </div>

            <div>
                <label className={labelClassName} htmlFor="presiding">
                    Presiding leader
                </label>
                <input
                    id="presiding"
                    name="presiding"
                    required
                    maxLength={255}
                    defaultValue={values.presiding}
                    className={fieldClassName}
                    {...getFieldErrorProps("presiding")}
                />
                <FieldError field="presiding" errors={state.errors} />
            </div>

            <div>
                <label className={labelClassName} htmlFor="conducting">
                    Conducting leader
                </label>
                <input
                    id="conducting"
                    name="conducting"
                    required
                    maxLength={255}
                    defaultValue={values.conducting}
                    className={fieldClassName}
                    {...getFieldErrorProps("conducting")}
                />
                <FieldError field="conducting" errors={state.errors} />
            </div>

            <div>
                <label className={labelClassName} htmlFor="announcements">
                    Announcements
                </label>
                <textarea
                    id="announcements"
                    name="announcements"
                    rows={4}
                    maxLength={4000}
                    defaultValue={values.announcements}
                    className={fieldClassName}
                    {...getFieldErrorProps("announcements")}
                />
                <p className="mt-1 text-sm text-muted">
                    Enter one announcement per line.
                </p>
                <FieldError field="announcements" errors={state.errors} />
            </div>

            <fieldset className="grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-2">
                <legend className="px-2 font-semibold">Opening hymn</legend>
                <div>
                    <label className={labelClassName} htmlFor="opening_hymn_id">
                        Hymn
                    </label>
                    <select
                        id="opening_hymn_id"
                        name="opening_hymn_id"
                        required
                        defaultValue={values.opening_hymn_id}
                        className={fieldClassName}
                        {...getFieldErrorProps("opening_hymn_id")}
                    >
                        <option value="">Select a hymn</option>
                        {hymns.map((hymn) => (
                            <option key={hymn.id} value={String(hymn.id)}>
                                {hymn.id} - {hymn.title}
                            </option>
                        ))}
                    </select>
                    <FieldError field="opening_hymn_id" errors={state.errors} />
                </div>
            </fieldset>

            <div>
                <label className={labelClassName} htmlFor="opening_prayer">
                    Opening prayer
                </label>
                <input
                    id="opening_prayer"
                    name="opening_prayer"
                    required
                    maxLength={255}
                    defaultValue={values.opening_prayer}
                    className={fieldClassName}
                    {...getFieldErrorProps("opening_prayer")}
                />
                <FieldError field="opening_prayer" errors={state.errors} />
            </div>

            <div>
                <label className={labelClassName} htmlFor="ward_business">
                    Ward business
                </label>
                <textarea
                    id="ward_business"
                    name="ward_business"
                    rows={4}
                    maxLength={4000}
                    defaultValue={values.ward_business}
                    className={fieldClassName}
                    {...getFieldErrorProps("ward_business")}
                />
                <p className="mt-1 text-sm text-muted">
                    Enter one item per line.
                </p>
                <FieldError field="ward_business" errors={state.errors} />
            </div>

            <div>
                <label
                    className="flex items-center gap-3 font-semibold"
                    htmlFor="stake_business"
                >
                    <input
                        id="stake_business"
                        name="stake_business"
                        type="checkbox"
                        defaultChecked={values.stake_business}
                        className="h-5 w-5 accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        {...getFieldErrorProps("stake_business")}
                    />
                    Stake business is included
                </label>
                <FieldError field="stake_business" errors={state.errors} />
            </div>

            <fieldset className="grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-2">
                <legend className="px-2 font-semibold">Sacrament hymn</legend>
                <div>
                    <label className={labelClassName} htmlFor="sacrament_hymn_id">
                        Hymn
                    </label>
                    <select
                        id="sacrament_hymn_id"
                        name="sacrament_hymn_id"
                        required
                        defaultValue={values.sacrament_hymn_id}
                        className={fieldClassName}
                        {...getFieldErrorProps("sacrament_hymn_id")}
                    >
                        <option value="">Select a hymn</option>
                        {hymns.map((hymn) => (
                            <option key={hymn.id} value={String(hymn.id)}>
                                {hymn.id} - {hymn.title}
                            </option>
                        ))}
                    </select>
                    <FieldError field="sacrament_hymn_id" errors={state.errors} />
                </div>
            </fieldset>

            <div>
                <label className={labelClassName} htmlFor="intermediate_hymn_id">
                    Intermediate hymn (optional)
                </label>
                <select
                    id="intermediate_hymn_id"
                    name="intermediate_hymn_id"
                    defaultValue={values.intermediate_hymn_id}
                    className={fieldClassName}
                    {...getFieldErrorProps("intermediate_hymn_id")}
                >
                    <option value="">No intermediate hymn</option>
                    {hymns.map((hymn) => (
                        <option key={hymn.id} value={String(hymn.id)}>
                            {hymn.id} - {hymn.title}
                        </option>
                    ))}
                </select>
                <FieldError field="intermediate_hymn_id" errors={state.errors} />
            </div>

            <div>
                <label className={labelClassName} htmlFor="musical_number_ids">
                    Musical hymns (optional)
                </label>
                <p id="musical-numbers-help" className="mt-1 text-sm text-muted">
                    Enter one hymn number per line.
                </p>
                <textarea
                    id="musical_number_ids"
                    name="musical_number_ids"
                    rows={4}
                    maxLength={4000}
                    placeholder={"152\n301"}
                    defaultValue={values.musical_number_ids}
                    className={fieldClassName}
                    {...getFieldErrorProps("musical_number_ids", "musical-numbers-help")}
                />
                <FieldError field="musical_number_ids" errors={state.errors} />
            </div>

            <div>
                <label className={labelClassName} htmlFor="speakers">
                    Speakers
                </label>
                <p id="speakers-help" className="mt-1 text-sm text-muted">
                    Enter one speaker per line as Name | Topic. The topic is optional.
                </p>
                <textarea
                    id="speakers"
                    name="speakers"
                    rows={5}
                    maxLength={6000}
                    placeholder={
                        "Brother Smith | Reverence\nSister Jones | Faith"
                    }
                    defaultValue={values.speakers}
                    className={fieldClassName}
                    {...getFieldErrorProps("speakers", "speakers-help")}
                />
                <FieldError field="speakers" errors={state.errors} />
            </div>

            <fieldset className="grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-2">
                <legend className="px-2 font-semibold">Closing hymn</legend>
                <div>
                    <label className={labelClassName} htmlFor="closing_hymn_id">
                        Hymn
                    </label>
                    <select
                        id="closing_hymn_id"
                        name="closing_hymn_id"
                        required
                        defaultValue={values.closing_hymn_id}
                        className={fieldClassName}
                        {...getFieldErrorProps("closing_hymn_id")}
                    >
                        <option value="">Select a hymn</option>
                        {hymns.map((hymn) => (
                            <option key={hymn.id} value={String(hymn.id)}>
                                {hymn.id} - {hymn.title}
                            </option>
                        ))}
                    </select>
                    <FieldError field="closing_hymn_id" errors={state.errors} />
                </div>
            </fieldset>

            <div>
                <label className={labelClassName} htmlFor="closing_prayer">
                    Closing prayer
                </label>
                <input
                    id="closing_prayer"
                    name="closing_prayer"
                    required
                    maxLength={255}
                    defaultValue={values.closing_prayer}
                    className={fieldClassName}
                    {...getFieldErrorProps("closing_prayer")}
                />
                <FieldError field="closing_prayer" errors={state.errors} />
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2">
                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-lg bg-action px-5 py-3 font-semibold text-foreground hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60"
                >
                    {submitLabel}
                </button>
                <Link
                    href="/meetings"
                    className="rounded-sm font-semibold text-accent underline underline-offset-4 hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
