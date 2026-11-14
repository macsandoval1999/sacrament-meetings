# The types folder

The `types` folder describes the shape of the data used by the app. TypeScript
uses these definitions to check code while developing; they do not fetch or
store data, and they do not validate API responses at runtime. 

Types are very similar to schemas.
Your SacramentMeeting interface describes the expected fields while you’re writing code:

TypeScript can warn you if you forget title or give number a string. But the interface is not present when the app runs, so it cannot check data received from an API.

Runtime schema
A runtime schema can inspect actual incoming data while the app is running and reject values that don’t match the expected structure. For example, it could check that an API response really contains a numeric hymn number and a string title.

In short: types help catch mistakes during development; runtime schemas validate actual data when the app runs. They can describe the same shape and work together.

## Meeting types

[`meetings-types.ts`](./meetings-types.ts) defines:

- `MeetingType`: the allowed meeting type values.
- `Hymn`: a hymn's number and title.
- `SpeakerItem`: a speaker or musical number, with a name and topic.
- `WardBusinessItem`: a ward business description.
- `SacramentMeeting`: the complete meeting, combining these types with its
  date, leadership, prayers, hymns, and other agenda fields.

For example, the sample meetings use `SacramentMeeting` so TypeScript can check
that each meeting has the expected fields. Components also use the type to
describe the meeting data they receive.
