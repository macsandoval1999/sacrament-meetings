/* NOTE:
    This component uses a native modal dialog to confirm meeting deletion.
    The form inside the dialog submits the meeting ID to its Server Action.
*/

"use client";

import { useRef } from "react";
import { deleteMeeting } from "@/lib/meetings/actions";
import { formatMeetingDate } from "@/lib/helpers";

export default function DeleteMeetingButton({
    id,
    date,
}: {
    id: number;
    date: string;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const meetingDate = formatMeetingDate(date);
    const action = deleteMeeting.bind(null, String(id));

    function openDialog() {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
        if (cancelButtonRef.current) {
            cancelButtonRef.current.focus();
        }
    }

    function closeDialog() {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={openDialog}
                aria-label={`Delete meeting on ${meetingDate}`}
                className="rounded-sm font-semibold text-accent underline underline-offset-4 hover:text-accent-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                Delete
            </button>
            <dialog
                ref={dialogRef}
                aria-labelledby={`delete-meeting-title-${id}`}
                aria-describedby={`delete-meeting-description-${id}`}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        event.stopPropagation();
                        closeDialog();
                    }
                }}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        const bounds =
                            event.currentTarget.getBoundingClientRect();
                        if (
                            event.clientX < bounds.left ||
                            event.clientX > bounds.right ||
                            event.clientY < bounds.top ||
                            event.clientY > bounds.bottom
                        ) {
                            closeDialog();
                        }
                    }
                }}
                className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-6 text-foreground shadow-xl backdrop:bg-black/75"
            >
                <h2
                    id={`delete-meeting-title-${id}`}
                    className="text-2xl font-semibold"
                >
                    Delete meeting?
                </h2>
                <p
                    id={`delete-meeting-description-${id}`}
                    className="mt-4 text-muted"
                >
                    Delete the meeting on {meetingDate}? This cannot be undone.
                </p>
                <form action={action} className="mt-6 flex flex-wrap gap-4">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={closeDialog}
                        className="rounded-lg border border-border px-4 py-3 font-semibold hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-action px-4 py-3 font-semibold text-foreground hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        Delete meeting
                    </button>
                </form>
            </dialog>
        </>
    );
}
