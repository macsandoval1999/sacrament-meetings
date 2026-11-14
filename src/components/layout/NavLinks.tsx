"use client";



import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";



const links = [
    { href: "/", label: "Home" },
    { href: "/meetings", label: "Meetings" },
];



// Styles for navigation links
// It is easier to read when separated from the component logic and easier to maintain
const linkStyles =
    "block rounded-lg px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const activeLinkStyles = "bg-action text-white";
const inactiveLinkStyles = "text-muted hover:bg-background hover:text-foreground";



export default function NavLinks() {
    const pathname = usePathname();

    return (
        <MobileMenu>
            <ul className="flex flex-col gap-1">
                {links.map(({ href, label }) => {
                    // if the current pathname matches the link href, mark it as active. Or if the link is not the root, check if the pathname starts with the link href.
                    const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

                    return (
                        // key is a unique identifier for each link, using the href as it is unique
                        <li key={href}>
                            {/* for the aria-current attribute, set it to "page" if the link is active, otherwise undefined. This helps assistive technologies understand which page is currently active. */}
                            {/* for the className attribute, check if the link is active and apply the appropriate styles */}
                            <Link href={href} aria-current={isActive ? "page" : undefined}
                                className={`${linkStyles} ${isActive ? activeLinkStyles : inactiveLinkStyles}`}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </MobileMenu>
    );
}
