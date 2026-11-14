"use client";



// useEffect is used to handle closing the mobile menu when clicking outside, pressing Escape, focusing outside, scrolling, or changing breakpoints. Think of an event listener that manages these interactions.
// useRef is used to reference the button and navigation elements to determine if a click or focus event occurred outside of them.
// useState is used to manage the open/closed state of the mobile menu.
import { useEffect, useRef, useState } from "react";
// ReactNode is used to type the children prop of the MobileMenu component. ReactNode represents any valid React child, such as elements, strings, numbers, or fragments. It is useful for typing components that accept arbitrary children.
import type { ReactNode } from "react";



// Styles for the mobile menu container
// It is easier to read when separated from the component logic and easier to maintain
const menuStyles =
    "absolute top-[calc(100%-0.25rem)] right-5 w-[min(18rem,calc(100%-2.5rem))] rounded-2xl border border-border bg-surface p-2 shadow-2xl shadow-black/30 transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none sm:right-8 lg:visible lg:static lg:mt-10 lg:w-auto lg:translate-y-0 lg:rounded-none lg:border-0 lg:p-0 lg:opacity-100 lg:shadow-none";
const openMenuStyles = "visible translate-y-0 opacity-100";
const closedMenuStyles = "invisible pointer-events-none -translate-y-2 opacity-0 lg:pointer-events-auto";



// MobileMenu component handles the rendering and behavior of the mobile navigation menu. It manages the open/closed state and ensures accessibility and proper interaction handling. MobileMenu takes in a children prop, which represents the content to be rendered inside the menu, and must return a React element containing the menu structure.
// The component also sets up event listeners to close the menu when clicking outside, pressing Escape, focusing outside, scrolling, or changing breakpoints, and cleans up these listeners when the menu is closed.
// This function depends on the isOpen state, as shown at the end of the useEffect hook [isOpen], to determine whether to set up or remove event listeners for handling menu interactions.
export default function MobileMenu({ children }: { children: ReactNode }) {
    //Setup
    // define the isOpen state, with a default value of false (menu is initially closed). setIsOpen is used to update this state based on user interactions.
    const [isOpen, setIsOpen] = useState(false);
    // similar to a query selector, useRef is used to get references to the button and navigation elements for event handling and accessibility purposes.
    const buttonRef = useRef<HTMLButtonElement>(null);
    // navRef is used to reference the navigation element for event handling and accessibility purposes.
    const navRef = useRef<HTMLElement>(null);

    // basically an event listener setup for handling clicks, key presses, focus changes, scrolling, and breakpoint changes when the menu is open.
    useEffect(() => {
        // if the menu is not open, no need to set up event listeners
        if (!isOpen) return;

        // function to check if a given target element is outside the menu and button, used to determine if the menu should be closed when clicking or focusing outside
        function hideMenuIfOutside(target: EventTarget | null) {
            return (
                target instanceof Node &&
                !buttonRef.current?.contains(target) &&
                !navRef.current?.contains(target)
            );
        }

        // handlePointerDown closes the menu if a click occurs outside the menu or button.
        function hideMenuOnPointerDown(event: PointerEvent) {
            if (hideMenuIfOutside(event.target)) setIsOpen(false);
        }

        // handleKeyDown closes the menu when the Escape key is pressed and returns focus to the button.
        function hideMenuOnKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        }

        // handleFocusIn closes the menu if focus moves outside the menu or button.
        function hideMenuOnFocusIn(event: FocusEvent) {
            if (hideMenuIfOutside(event.target)) setIsOpen(false);
        }

        // handleScroll closes the menu when the user scrolls the page.
        function hideMenuOnScroll() {
            setIsOpen(false);
        }

        // handleBreakpointChange closes the menu when the viewport reaches the desktop breakpoint.
        const desktop = window.matchMedia("(min-width: 64rem)");
        function handleBreakpointChange(event: MediaQueryListEvent) {
            if (event.matches) setIsOpen(false);
        }

        // useEffect is used to set up and clean up event listeners for handling menu interactions. We still need event listeners as useEffect triggers after the initial render. Its essentialy a wrapper around the event listener setup and cleanup logic.
        document.addEventListener("pointerdown", hideMenuOnPointerDown);
        document.addEventListener("keydown", hideMenuOnKeyDown);
        document.addEventListener("focusin", hideMenuOnFocusIn);
        window.addEventListener("scroll", hideMenuOnScroll, { passive: true });
        desktop.addEventListener("change", handleBreakpointChange);
        return () => {
            document.removeEventListener("pointerdown", hideMenuOnPointerDown);
            document.removeEventListener("keydown", hideMenuOnKeyDown);
            document.removeEventListener("focusin", hideMenuOnFocusIn);
            window.removeEventListener("scroll", hideMenuOnScroll);
            desktop.removeEventListener("change", handleBreakpointChange);
        };
    }, [isOpen]);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={isOpen}
                aria-controls="primary-navigation"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setIsOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            >
                <span aria-hidden="true" className="relative block h-5 w-5">
                    <span
                        className={`absolute top-1 left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "translate-y-1.5 rotate-45" : ""}`}
                    />
                    <span
                        className={`absolute top-2.5 left-0 h-0.5 w-full rounded-full bg-current transition-opacity duration-200 motion-reduce:transition-none ${isOpen ? "opacity-0" : "opacity-100"}`}
                    />
                    <span
                        className={`absolute top-4 left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
                    />
                </span>
            </button>
            <nav
                // ref for the navigation element to handle clicks outside of it and focus events
                ref={navRef}
                id="primary-navigation"
                aria-label="Primary navigation"
                onClick={(event) => {
                    // A click on a link can originate from an element inside it.
                    if (event.target instanceof Element && event.target.closest("a")) {
                        setIsOpen(false);
                    }
                }}
                className={`${menuStyles} ${isOpen ? openMenuStyles : closedMenuStyles}`}
            >
                {children}
            </nav>
        </>
    );
}
