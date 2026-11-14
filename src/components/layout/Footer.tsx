import { wardName } from "../../lib/helpers";

export default function Footer() {
    return (
        <footer className="border-t border-border px-5 py-6 text-sm text-muted sm:px-8">
            <div className="mx-auto max-w-6xl">
                Sacrament meeting agendas &middot; {wardName}
            </div>
        </footer>
    );
}