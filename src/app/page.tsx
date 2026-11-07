import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
                Welcome
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Gather in worship, together.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Find sacrament meeting agendas, hymns, speakers, and announcements in
                one place.
            </p>
            <Link
                href="/meetings"
                className="mt-8 inline-flex rounded-lg bg-action px-5 py-3 font-semibold text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                View meetings <span aria-hidden="true" className="ml-3">&rarr;</span>
            </Link>
            <Image
                src="/images/meeting.png"
                alt="An open hymnbook with musical notes"
                width={720}
                height={320}
                className="mt-10 h-auto w-full rounded-xl border border-border"
            />
        </div>
    );
}
