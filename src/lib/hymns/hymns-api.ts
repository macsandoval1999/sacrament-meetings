/* Note: 
    This helper is intended for server-side use. It uses environment variables to resolve the API origin and should not be imported into client components. We call this helper when we need to fetch project data from the API without caching the response. 
    Without this helper, each caller would need to resolve the API origin and configure the fetch options itself.
*/



/***** IMPORTS *****/
// io is a Next.js API for marking a function as I/O-bound, so it isn't cached. This means
// the fetch runs on every call instead of reusing a cached response. This will
// ensure the API returns fresh data rather than a stale cached response.
import { io } from "next/cache";



/****** FETCH MEETINGS API *****/
// This helper fetches meeting data from the API without caching the response. This ensures the API returns fresh data rather than a stale cached response. We use io() to mark the fetch as I/O-bound so it runs on every call.
// It takes a path and optional RequestInit options, then returns the API response.
export async function fetchHymnsApi(
    path: string,
    init?: RequestInit
): Promise<Response> {
    // Mark this function as I/O-bound so the fetch runs on every call.
    await io();
    // Resolve the API origin from the environment, falling back to localhost in development. This is used as the base URL for the fetch request.
    let origin = process.env.HYMNS_API_ORIGIN;
    if (!origin) {
        if (process.env.VERCEL_URL) {
            origin = `https://${process.env.VERCEL_URL}`;
        } else {
            origin = `http://localhost:${process.env.PORT || "3000"}`;
        }
    }

    // Resolve the path against the origin and fetch the API response.
    return fetch(new URL(path, origin), {
        ...init,
        cache: "no-store",
        redirect: "error",
    });
}

