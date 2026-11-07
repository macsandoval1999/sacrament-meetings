import MeetingList from "../../components/meetings/MeetingsList";

export default function MeetingsPage() {
    return (
        <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Agendas</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Sacrament meetings</h1>
            <p className="mt-3 text-muted">Choose a meeting to view its full agenda.</p>
            <MeetingList />
        </div>
    );
}