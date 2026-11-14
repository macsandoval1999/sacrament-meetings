// We "use client" because this component relies on client-side navigation and window scrolling behavior.
"use client";



// usePathname is a hook from Next.js for getting the current pathname.
import { usePathname } from "next/navigation";
// useLayoutEffect is a React hook that runs synchronously after all DOM mutations.
// useRef is a React hook for creating a mutable reference that persists across renders.
import { useLayoutEffect, useRef } from "react";



// With the hooks above, we can track the current and previous pathname and scroll to the top of the page when the pathname changes.
export default function ScrollToTop() {
    // usePathname reads the URL path (for example, "/meetings"), without
    // the query string or hash. Next.js updates it after client-side navigation,
    // such as clicking a meeting link or using the browser's back/forward buttons.
    const pathname = usePathname();
    // A ref persists between renders without causing a render when updated.
    // Starting with the current path prevents a scroll reset on the first render.
    const previousPathname = useRef(pathname);

    // React runs this effect after the DOM updates and before the browser paints.
    // The dependency [pathname] makes it run again when the pathname changes.
    useLayoutEffect(() => {
        // Check if the pathname has changed since the last render.
        if (previousPathname.current !== pathname) {
            // If not, remember the new path for the next navigation.
            previousPathname.current = pathname;
            // Then check if the URL has a hash (anchor). If it doesn't, scroll to the top. It would have a hash if the user navigated to a specific section of the page via an anchor link.
            if (!window.location.hash) {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }
        } 
        // [pathname] is the dependency array for this effect, meaning this effect will run whenever the pathname changes.
    }, [pathname]);

    return null;
}
