# The lib folder

The `lib` folder contains reusable data, API, and validation modules.

## Modules

- **`api/api-responses.ts`** defines TypeScript types for the shared meeting
  API response envelope and its error, paginated-list, and by-date data. The
  meeting list and current-meeting view use these response types. They provide
  compile-time checking only; they do not validate JSON at runtime.
- **`helpers.ts`** contains shared ward-name and date-formatting helpers.
- **`meetings/actions.ts`** defines the create, update, and delete Server
  Actions used by the meeting forms and delete controls.
- **`meetings/controllers`** validates HTTP requests, calls the models, and
  returns API responses.
- **`meetings/models/meetings-models.ts`** reads and mutates Neon meeting
  records with SQL.
- **`meetings/meetings-api.ts`** provides an uncached server-side API fetch
  helper for callers that need to request the HTTP API.
- **`meetings/meetings-schemas.ts`** defines Zod schemas for form and API
  payloads and formats field validation errors.
- **`meetings/meetings-types.ts`** defines meeting, form-input, and form-state
  types.
- **`meetings/meetings-validation.ts`** validates meeting dates and IDs.

The JSON API and the meeting Server Actions are backed by the same meeting
models.
