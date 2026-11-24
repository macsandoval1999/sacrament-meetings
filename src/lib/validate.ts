export function parseWholeNumber(
    value: string,
    minimum: number,
    maximum: number
): number | null {
    if (!/^\d+$/.test(value)) {
        return null;
    }
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < minimum || number > maximum) {
        return null;
    }
    return number;
}

export function isDuplicateError(error: unknown, constraint?: string): boolean {
    if (typeof error !== "object" || error === null || !("code" in error)) {
        return false;
    }
    if (error.code !== "23505") {
        return false;
    }
    if (constraint) {
        return "constraint" in error && error.constraint === constraint;
    }
    return true;
}