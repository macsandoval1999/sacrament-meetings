import type { ReactNode } from "react";

interface SectionLoadingProps {
    label: string;
    variant: "meetings" | "meeting-details" | "search";
}

const skeleton = "motion-safe:animate-pulse bg-border";

function SkeletonCard() {
    return (
        <article className="h-56 rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className={`h-3 w-24 ${skeleton}`} />
            <div className={`mt-6 h-6 w-3/4 ${skeleton}`} />
            <div className={`mt-6 h-4 w-1/2 ${skeleton}`} />
            <div className={`mt-8 h-4 w-28 ${skeleton}`} />
        </article>
    );
}

export default function SectionLoading({
    label,
    variant,
}: SectionLoadingProps) {
    let content: ReactNode;

    if (variant === "meetings") {
        content = (
            <div
                aria-hidden="true"
                className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
                {Array.from({ length: 6 }, (_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    } else if (variant === "meeting-details") {
        content = (
            <div aria-hidden="true" className="motion-safe:animate-pulse">
                <div className={`h-4 w-28 ${skeleton}`} />
                <div className={`mt-4 h-10 w-2/3 ${skeleton}`} />
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="h-40 rounded-xl border border-border bg-surface" />
                    <div className="h-40 rounded-xl border border-border bg-surface" />
                </div>
                <div className="mt-6 h-[32rem] rounded-xl border border-border bg-surface" />
            </div>
        );
    } else {
        content = (
            <div
                aria-hidden="true"
                className="mt-6 max-w-xl"
            >
                <div className={`h-[4.5rem] rounded-lg border border-border bg-surface ${skeleton}`} />
            </div>
        );
    }

    return (
        <div role="status" aria-label={label} aria-live="polite">
            <span className="sr-only">{label}</span>
            {content}
        </div>
    );
}
