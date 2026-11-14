

// Helper function to format a meeting date string into a human-readable format
export function formatMeetingDate(date: string): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));
}

// Helper function to validate if a string is a valid ISO date (YYYY-MM-DD)
export function isValidISODate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Helper function to get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// Helper function to get the upcoming Sunday's date in YYYY-MM-DD format
export function getUpcomingSundayDate(): string {
    // Work in UTC after capturing the local calendar date to avoid time-zone shifts.
    const sunday = new Date(`${getTodayDate()}T00:00:00Z`);
    sunday.setUTCDate(sunday.getUTCDate() + (7 - sunday.getUTCDay()) % 7);
    return sunday.toISOString().slice(0, 10);
}

// Name of the ward
export const wardName = "Adobe Villa Ward";
