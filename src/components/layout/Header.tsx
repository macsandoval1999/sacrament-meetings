"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { wardName } from "../../lib/helpers";
import NavLinks from "./NavLinks";
import CurrentDate from "../behaviors/CurrentDate";

export default function Header() {
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        let lastY = window.scrollY;
        let directionStart = lastY;
        let direction = 0;
        const desktop = window.matchMedia("(min-width: 64rem)");

        function handleScroll() {
            const maxY = Math.max(
                0,
                document.documentElement.scrollHeight - window.innerHeight
            );
            const currentY = Math.max(0, Math.min(window.scrollY, maxY));
            const nextDirection = Math.sign(currentY - lastY);

            if (nextDirection && nextDirection !== direction) {
                direction = nextDirection;
                directionStart = lastY;
            }

            if (desktop.matches || currentY <= 12) {
                setIsHidden(false);
            } else if (Math.abs(currentY - directionStart) >= 8) {
                setIsHidden(direction > 0);
            }
            lastY = currentY;
        }

        function handleBreakpointChange() {
            lastY = window.scrollY;
            directionStart = lastY;
            direction = 0;
            setIsHidden(false);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        desktop.addEventListener("change", handleBreakpointChange);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            desktop.removeEventListener("change", handleBreakpointChange);
        };
    }, []);

    return (
        <header
            onFocusCapture={() => setIsHidden(false)}
            className={`sticky top-0 z-10 border-b border-border bg-surface transition-transform duration-300 ease-out motion-reduce:transition-none lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-72 lg:translate-y-0 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-b-0 lg:transition-none ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
        >
            <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:block lg:px-7 lg:py-9">
                <div>
                    <Link
                        href="/"
                        className="block text-lg font-bold tracking-tight text-foreground"
                    >
                        {wardName}
                    </Link>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                        Sacrament meetings
                    </p>
                    <CurrentDate />
                </div>
                <Suspense fallback={<div className="h-10 w-10 lg:hidden" />}>
                    <NavLinks />
                </Suspense>
            </div>
        </header>
    );
}
