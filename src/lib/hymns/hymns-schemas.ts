import { z } from "zod";
import { normalizeHymnTitle } from "./hymns-validation";
import type { HymnInput } from "./hymns-types";

export const HymnSchema = z.object({
    id: z.number().int().positive().max(2147483647),
    title: z
        .string()
        .trim()
        .min(1)
        .max(255)
        .transform(normalizeHymnTitle),
}).transform((value): HymnInput => ({
    id: value.id,
    title: value.title,
}));
