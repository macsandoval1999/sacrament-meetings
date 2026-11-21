# The api folder

The `api` folder contains Next.js Route Handlers: server-side endpoints that
respond to HTTP requests. Unlike a page, an API endpoint generally returns
data, such as JSON, rather than a user interface.

Each `route.ts` file defines a route based on its folder path. An exported
function such as `GET` handles that HTTP request method.

## Meeting endpoints

- `GET /api/meetings` returns a paginated list, optionally filtered with
  `query`, and accepts `page` and `limit` (default 6, maximum 50). Its
  response includes the search, sort order, pagination totals, and the first
  and last positions displayed (`startItem` and `endItem`, both 0 for an empty
  page). Add a date
  query parameter, such as
  `/api/meetings?date=2026-11-08`, to return the meeting for that date.
  A date with no matching meeting returns **404**.
- `GET /api/meetings/1` returns the meeting with ID `1`. The `[id]` folder is
  a dynamic route segment, so the handler reads the ID from the URL.

The ID endpoint returns **200** when a meeting is found, **400** for an invalid
ID, and **404** when a valid ID has no matching meeting. In this version of
Next.js, the handler awaits `params` before reading the ID.

The handlers retrieve their data from
[`src/lib/meetings-db.ts`](../../lib/meetings-db.ts). The
meeting pages fetch these endpoints and pass the results to UI components.

Visit `/api-docs` for interactive endpoint and response documentation. Run
`npm run swagdoc` after changing the route OpenAPI comments or shared schemas.