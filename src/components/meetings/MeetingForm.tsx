/* NOTE:
    This client component renders the create and edit meeting forms.
    useActionState submits the values to a Server Action and displays its
    field-level validation messages in polite live regions.
*/

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type {
    MeetingFormInput,
    MeetingFormState,
    SacramentMeeting,
} from "@/lib/meetings/meetings-types";

interface MeetingFormProps {
    action: (
        state: MeetingFormState,
        formData: FormData
    ) => Promise<MeetingFormState>;
    meeting?: SacramentMeeting;
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
            opening_hymn_number: "",
            opening_hymn_title: "",
            opening_prayer: "",
            ward_business: "",
            stake_business: false,
            sacrament_hymn_number: "",
            sacrament_hymn_title: "",
            speakers: "",
            closing_hymn_number: "",
            closing_hymn_title: "",
            closing_prayer: "",
        };
    }

    return {
        date: meeting.date,
        meeting_type: meeting.meeting_type,
        presiding: meeting.presiding,
        conducting: meeting.conducting,
        announcements: (meeting.announcements ?? []).join("\n"),
        opening_hymn_number: String(meeting.opening_hymn.number),
        opening_hymn_title: meeting.opening_hymn.title,
        opening_prayer: meeting.opening_prayer,
        ward_business: meeting.ward_business
            .map((item) => item.description)
            .join("\n"),
        stake_business: meeting.stake_business,
        sacrament_hymn_number: String(meeting.sacrament_hymn.number),
        sacrament_hymn_title: meeting.sacrament_hymn.title,
        speakers: meeting.speakers
            .map((item) => `${item.name} | ${item.topic} | ${item.type}`)
            .join("\n"),
        closing_hymn_number: String(meeting.closing_hymn.number),
        closing_hymn_title: meeting.closing_hymn.title,
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

export default function MeetingForm({ action, meeting }: MeetingFormProps) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const [values, setValues] = useState(() => getInitialValues(meeting));

    function updateField(
        name: keyof MeetingFormInput,
        value: string | boolean
    ) {
        setValues((current) => ({ ...current, [name]: value }));
    }

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
                    value={values.date}
                    onChange={(event) =>
                        updateField("date", event.target.value)
                    }
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
                    value={values.meeting_type}
                    onChange={(event) =>
                        updateField("meeting_type", event.target.value)
                    }
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
                    value={values.presiding}
                    onChange={(event) =>
                        updateField("presiding", event.target.value)
                    }
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
                    value={values.conducting}
                    onChange={(event) =>
                        updateField("conducting", event.target.value)
                    }
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
                    value={values.announcements}
                    onChange={(event) =>
                        updateField("announcements", event.target.value)
                    }
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
                    <label
                        className={labelClassName}
                        htmlFor="opening_hymn_number"
                    >
                        Hymn number
                    </label>
                    <input
                        id="opening_hymn_number"
                        name="opening_hymn_number"
                        type="number"
                        min={1}
                        step={1}
                        required
                        value={values.opening_hymn_number}
                        onChange={(event) =>
                            updateField(
                                "opening_hymn_number",
                                event.target.value
                            )
                        }
                        className={fieldClassName}
                        {...getFieldErrorProps("opening_hymn_number")}
                    />
                    <FieldError
                        field="opening_hymn_number"
                        errors={state.errors}
                    />
                </div>
                <div>
                    <label
                        className={labelClassName}
                        htmlFor="opening_hymn_title"
                    >
                        Hymn title
                    </label>
                    <input
                        id="opening_hymn_title"
                        name="opening_hymn_title"
                        required
                        maxLength={255}
                        value={values.opening_hymn_title}
                        onChange={(event) =>
                            updateField(
                                "opening_hymn_title",
                                event.target.value
                            )
                        }
                        className={fieldClassName}
                        {...getFieldErrorProps("opening_hymn_title")}
                    />
                    <FieldError
                        field="opening_hymn_title"
                        errors={state.errors}
                    />
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
                    value={values.opening_prayer}
                    onChange={(event) =>
                        updateField("opening_prayer", event.target.value)
                    }
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
                    value={values.ward_business}
                    onChange={(event) =>
                        updateField("ward_business", event.target.value)
                    }
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
                        checked={values.stake_business}
                        onChange={(event) =>
                            updateField("stake_business", event.target.checked)
                        }
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
                    <label
                        className={labelClassName}
                        htmlFor="sacrament_hymn_number"
                    >
                        Hymn number
                    </label>
                    <input
                        id="sacrament_hymn_number"
                        name="sacrament_hymn_number"
                        type="number"
                        min={1}
                        step={1}
                        required
                        value={values.sacrament_hymn_number}
                        onChange={(event) =>
                            updateField(
                                "sacrament_hymn_number",
                                event.target.value
                            )
                        }
                        className={fieldClassName}
                        {...getFieldErrorProps("sacrament_hymn_number")}
                    />
                    <FieldError
                        field="sacrament_hymn_number"
                        errors={state.errors}
                    />
                </div>
                <div>
                    <label
                        className={labelClassName}
                        htmlFor="sacrament_hymn_title"
                    >
                        Hymn title
                    </label>
                    <input
                        id="sacrament_hymn_title"
                        name="sacrament_hymn_title"
                        required
                        maxLength={255}
                        value={values.sacrament_hymn_title}
                        onChange={(event) =>
                            updateField(
                                "sacrament_hymn_title",
                                event.target.value
                            )
                        }
                        className={fieldClassName}
                        {...getFieldErrorProps("sacrament_hymn_title")}
                    />
                    <FieldError
                        field="sacrament_hymn_title"
                        errors={state.errors}
                    />
                </div>
            </fieldset>

            <div>
                <label className={labelClassName} htmlFor="speakers">
                    Speakers and musical numbers
                </label>
                <p id="speakers-help" className="mt-1 text-sm text-muted">
                    Enter one per line as Name | Topic | speaker or Name | Topic
                    | musical-number. The topic may be blank.
                </p>
                <textarea
                    id="speakers"
                    name="speakers"
                    rows={5}
                    maxLength={6000}
                    value={values.speakers}
                    onChange={(event) =>
                        updateField("speakers", event.target.value)
                    }
                    className={fieldClassName}
                    {...getFieldErrorProps("speakers", "speakers-help")}
                />
                <FieldError field="speakers" errors={state.errors} />
            </div>

            <fieldset className="grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-2">
                <legend className="px-2 font-semibold">Closing hymn</legend>
                <div>
                    <label
                        className={labelClassName}
                        htmlFor="closing_hymn_number"
                    >
                        Hymn number
                    </label>
                    <input
                        id="closing_hymn_number"
                        name="closing_hymn_number"
                        type="number"
                        min={1}
                        step={1}
                        required
                        value={values.closing_hymn_number}
                        onChange={(event) =>
                            updateField(
                                "closing_hymn_number",
                                event.target.value
                            )
                        }
                        className={fieldClassName}
                        {...getFieldErrorProps("closing_hymn_number")}
                    />
                    <FieldError
                        field="closing_hymn_number"
                        errors={state.errors}
                    />
                </div>
                <div>
                    <label
                        className={labelClassName}
                        htmlFor="closing_hymn_title"
                    >
                        Hymn title
                    </label>
                    <input
                        id="closing_hymn_title"
                        name="closing_hymn_title"
                        required
                        maxLength={255}
                        value={values.closing_hymn_title}
                        onChange={(event) =>
                            updateField(
                                "closing_hymn_title",
                                event.target.value
                            )
                        }
                        className={fieldClassName}
                        {...getFieldErrorProps("closing_hymn_title")}
                    />
                    <FieldError
                        field="closing_hymn_title"
                        errors={state.errors}
                    />
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
                    value={values.closing_prayer}
                    onChange={(event) =>
                        updateField("closing_prayer", event.target.value)
                    }
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
