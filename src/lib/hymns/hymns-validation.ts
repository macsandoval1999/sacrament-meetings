import { parseWholeNumber } from "@/lib/validate";

export function parseHymnId(value: string): number | null {
    return parseWholeNumber(value, 1, 2147483647);
}

export function normalizeHymnTitle(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}
