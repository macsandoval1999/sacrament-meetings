export function isValidISODate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

export function parseMeetingId(value: string): number | null {
    if (!/^\d+$/.test(value)) {
        return null;
    }
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id < 0 || id > 2147483647) {
        return null;
    }
    return id;
}
