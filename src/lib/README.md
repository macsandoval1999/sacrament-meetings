# The lib folder

The `lib` folder holds shared data and helper functions used by the app. These
functions support the UI but do not render components themselves.

## Files

- **`helpers.ts`** contains the ward name and date helpers:
  - `formatMeetingDate` turns a meeting date into readable text.
  - `getTodayDate` returns the local date as `YYYY-MM-DD`.
  - `getUpcomingSundayDate` finds the upcoming Sunday, including today when
    today is Sunday.
- **`meetings-db.ts`** holds the in-memory sample meetings. It provides
  `getAllMeetings`, `getMeetingById`, and `getMeetingByDate` for finding them.

The meeting API handlers call these data functions. The in-memory array is
sample data, not a persistent database: changes made at runtime are not saved.
