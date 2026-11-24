# Meeting API

The API is implemented with Next.js Route Handlers. Each request is validated
by a controller, which calls the shared database models and returns JSON.
Interactive OpenAPI documentation is available at `/api-docs`.

## Response envelope

Every controller response uses the same JSON shape, regardless of its HTTP
status:

```json
{
  "statusCode": 200,
  "message": "Meeting retrieved successfully.",
  "data": {},
  "errors": null
}
```

`statusCode` matches the HTTP response status. Successful responses include
the fetched or mutated data; error responses set `data` to `null` and include
an `errors` array with an error code, message, and optional field errors.
Delete returns **200** with the deleted meeting in `data` so its response body
can include the same envelope.

## Collection: `/api/meetings`

- `GET /api/meetings` returns meetings ordered newest to oldest. Optional query
  parameters are `query`, `page` (default `1`), and `limit` (default `6`,
  maximum `50`). `data` contains the meetings, search/sort metadata, and
  pagination totals and positions.
- `GET /api/meetings?date=2026-11-08` returns the meeting for that date. An
  invalid date returns **400**; a date with no meeting returns **404**. The
  meeting is in `data`.
- `POST /api/meetings` creates a meeting. Send an `application/json` body
  matching the `MeetingInput` schema shown in Swagger. The response is **201**;
  `data` contains the created meeting. Invalid JSON or meeting data returns
  **400**, and an unsupported content type returns **415**.

## Individual meeting: `/api/meetings/{id}`

- `GET /api/meetings/1` returns the meeting with ID `1`.
- `PUT /api/meetings/1` replaces the meeting with ID `1`. Send a full
  `MeetingInput` JSON object; the updated meeting is in `data`.
- `DELETE /api/meetings/1` deletes the meeting with ID `1` and returns the
  deleted meeting in `data`.

The item endpoints return **400** for an invalid ID and **404** when a valid ID
does not exist. Update and delete return **500** if the database operation
fails. The `[id]` route awaits Next.js `params` before validating the ID.

## Hymns

- `GET /api/hymns` lists hymns. Use `id`, `title`, or `query` to search.
- `GET /api/hymns/1` retrieves hymn `1`.
- `POST /api/hymns` creates a hymn with `{ "id": 1, "title": "..." }`.
- `PUT /api/hymns/1` updates its title; the body ID must match the URL.
- `DELETE /api/hymns/1` deletes it unless a meeting uses it.

The hymn ID is its hymn number. Meeting inputs use hymn IDs; meeting responses
include each hymn's ID and title.

## Meeting pages

The user-facing routes are `/meetings`, `/meetings/new`,
`/meetings/{id}`, and `/meetings/{id}/edit`. The create and edit forms and
delete controls submit Server Actions; they use the same models as the HTTP
API. Invalid IDs and missing meetings render the meeting not-found page.
