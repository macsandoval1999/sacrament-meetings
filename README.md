# Sacrament Meetings

A Next.js application for browsing sacrament meeting agendas.

Run `npm install` and then `npm run dev` to start the application. The meeting
pages load their data from `/api/meetings` and `/api/meetings/[id]`; the
collection endpoint also accepts a `date` query parameter in `YYYY-MM-DD` form.
The meeting list is ordered newest to oldest and marks meetings as conducted
starting the day after their date, using the visitor's local date.

The This Sunday page redirects to the upcoming Sunday meeting when one exists.
On Sunday it shows that day's meeting; at the start of Monday it switches to
the following Sunday. The calculation uses the server's local time zone.
If there is no meeting for that date, the page displays a message instead.

Run `npm run lint` and `npm run build` to check the application.

The header logo is in `public/images/ward-logo.svg`. The Open Graph preview
uses the static `public/images/social-preview.png` referenced in the root
layout's metadata. A generated `opengraph-image.tsx` is not needed because the
preview is the same for every page.

The browser icon uses the SVG logo, with `public/favicon.ico` as a fallback
for browsers that do not support SVG favicons.

Social sharing requires the site to be publicly reachable: the metadata uses
the Vercel deployment URL when available and otherwise falls back to
`http://localhost:3000` for local development.
