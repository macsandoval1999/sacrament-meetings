import { formatMeetingDate } from "../../lib/helpers";
import type { Hymn, SacramentMeeting } from "../../types/meetings-types";

function HymnEntry({ hymn }: { hymn: Hymn }) {
    return (
        <>
            {hymn.title} <span className="text-muted">(#{hymn.number})</span>
        </>
    );
}

export default function MeetingDetails({ meeting }: { meeting: SacramentMeeting }) {
    return (
        <article>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
                {meeting.meetingType} meeting
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                <time dateTime={meeting.date}>
                    {formatMeetingDate(meeting.date)}
                </time>
            </h1>
            <p className="mt-2 text-sm text-muted">Meeting #{meeting.id}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">
                        Meeting leadership
                    </h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div>
                            <dt className="font-semibold text-muted">
                                Presiding
                            </dt>
                            <dd className="mt-1">{meeting.presiding}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-muted">
                                Conducting
                            </dt>
                            <dd className="mt-1">{meeting.conducting}</dd>
                        </div>
                    </dl>
                </section>
                <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Announcements</h2>
                    {meeting.announcements &&
                    meeting.announcements.length > 0 ? (
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6">
                            {meeting.announcements.map(
                                (announcement, index) => (
                                    <li key={index}>{announcement}</li>
                                )
                            )}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-muted">
                            No announcements.
                        </p>
                    )}
                </section>
            </div>

            <section className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold">Order of service</h2>
                <dl className="mt-5 divide-y divide-border">
                    <div className="py-4">
                        <dt className="text-sm font-semibold text-muted">
                            Opening hymn
                        </dt>
                        <dd className="mt-1">
                            <HymnEntry hymn={meeting.openingHymn} />
                        </dd>
                    </div>
                    <div className="py-4">
                        <dt className="text-sm font-semibold text-muted">
                            Opening prayer
                        </dt>
                        <dd className="mt-1">{meeting.openingPrayer}</dd>
                    </div>
                    <div className="py-4">
                        <dt className="text-sm font-semibold text-muted">
                            Ward business
                        </dt>
                        <dd className="mt-1">
                            {meeting.wardBusiness.length > 0 ? (
                                <ul className="list-disc space-y-1 pl-5">
                                    {meeting.wardBusiness.map((item, index) => (
                                        <li key={index}>{item.description}</li>
                                    ))}
                                </ul>
                            ) : (
                                "None"
                            )}
                        </dd>
                    </div>
                    <div className="py-4">
                        <dt className="text-sm font-semibold text-muted">
                            Stake business
                        </dt>
                        <dd className="mt-1">
                            {meeting.stakeBusiness ? "Yes" : "None"}
                        </dd>
                    </div>
                    <div className="py-4">
                        <dt className="text-sm font-semibold text-muted">
                            Sacrament hymn
                        </dt>
                        <dd className="mt-1">
                            <HymnEntry hymn={meeting.sacramentHymn} />
                        </dd>
                    </div>
                    <div className="py-4">
                        <dt className="text-sm font-semibold text-muted">
                            Speakers and musical numbers
                        </dt>
                        <dd className="mt-1">
                            {meeting.speakers.length > 0 ? (
                                <ul className="space-y-3">
                                    {meeting.speakers.map((item, index) => (
                                        <li key={index}>
                                            <span className="font-medium">
                                                {item.name}
                                            </span>
                                            <span className="text-muted">
                                                {" "}
                                                &middot;{" "}
                                                {item.type === "musical-number"
                                                    ? "Musical number"
                                                    : "Speaker"}
                                            </span>
                                            {item.topic && (
                                                <p className="text-sm text-muted">
                                                    {item.topic}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                "None"
                            )}
                        </dd>
                    </div>
                    <div className="py-4">
                        <dt className="text-sm font-semibold text-muted">
                            Closing hymn
                        </dt>
                        <dd className="mt-1">
                            <HymnEntry hymn={meeting.closingHymn} />
                        </dd>
                    </div>
                    <div className="pt-4">
                        <dt className="text-sm font-semibold text-muted">
                            Closing prayer
                        </dt>
                        <dd className="mt-1">{meeting.closingPrayer}</dd>
                    </div>
                </dl>
            </section>
        </article>
    );
}
