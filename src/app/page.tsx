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
            <section aria-labelledby="this-sunday-heading" className="mt-10">
                <Link
                    href="/meetings/current"
                    className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent sm:p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                                Upcoming meeting
                            </p>
                            <h2
                                id="this-sunday-heading"
                                className="mt-2 text-2xl font-semibold tracking-tight"
                            >
                                This Sunday
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-muted">
                                Preview the agenda, hymns, speakers, and announcements.
                            </p>
                        </div>
                        <span className="w-fit rounded-lg bg-action px-4 py-3 font-semibold text-white transition-colors group-hover:bg-action-hover">
                            View the agenda <span aria-hidden="true">&rarr;</span>
                        </span>
                    </div>
                </Link>
            </section>
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
