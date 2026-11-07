"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface SubNavLinkItem {
    href: string;
    label: string;
}

interface SubNavLinksProps {
    links: SubNavLinkItem[];
    label: string;
}

export default function SubNavLinks({ links, label }: SubNavLinksProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const fromCurrentMeeting =
        // /^\/meetings\/\d+$/ is a regular expression that matches URLs like "/meetings/123" where 123 is any number. see comment below of file for explanation
        // Check if the current pathname matches the pattern for a specific meeting (e.g., "/meetings/123") and if the "from" search parameter is "current".
        /^\/meetings\/\d+$/.test(pathname) && searchParams.get("from") === "current";
    // check if if we are fromCurrentMeeting, if so set the activeHref to "/meetings/current" otherwise determine it based on the links array.
    const activeHref = fromCurrentMeeting ? "/meetings/current" : links.filter(({ href }) =>
        pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)))
        .sort((a, b) =>
            b.href.length - a.href.length)[0]?.href;

    return (
        <nav
            aria-label={label}
            className="mb-8 border-b-2 border-border font-mono text-sm"
        >
            <ul className="m-0 flex flex-wrap gap-x-6 gap-y-2 p-0">
                {links.map(({ href, label: linkLabel }) => {
                    const isActive = href === activeHref;

                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                aria-current={
                                    pathname === href ? "page" : isActive ? "location" : undefined
                                }
                                className={`inline-block border-b-2 py-3 transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                                    isActive
                                        ? "border-accent text-accent"
                                        : "border-transparent text-muted hover:text-foreground"
                                }`}
                            >
                                {linkLabel}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}



// Explanation for the regular expression /^\/meetings\/\d+$/
/* 
    /.../	Marks the beginning and end of the regex.
    ^	Start of the text.
    \/	A literal /. The backslash is needed because / also marks the edge of the regex.
    meetings	The exact text meetings.
    \/	Another literal /.
    \d	A digit from 0 to 9.
    +	One or more of the preceding item—in this case, digits.
    $	End of the text.


    /
*/