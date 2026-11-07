export function formatMeetingDate(date: string): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));
}

export function getTodayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function getUpcomingSundayDate(): string {
    // Work in UTC after capturing the local calendar date to avoid time-zone shifts.
    const sunday = new Date(`${getTodayDate()}T00:00:00Z`);
    sunday.setUTCDate(sunday.getUTCDate() + (7 - sunday.getUTCDay()) % 7);
    return sunday.toISOString().slice(0, 10);
}

export const wardName = "Adobe Villa Ward";
