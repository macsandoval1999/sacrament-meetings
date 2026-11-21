# The components folder

The `components` folder holds reusable pieces of the application's interface
and behavior. A component can be written once and used by one or more pages or
layouts.

## How the components are grouped

- **`layout`** contains shared site UI, including `Header`, `Footer`,
  `NavLinks`, `MobileMenu`, and `SubNavLinks`. `NavLinks` chooses the active
  links; `MobileMenu` wraps them and handles the responsive menu button and
  its behavior.
  The header and footer are composed in the root layout; meetings navigation
  is composed in the meetings layout.
- **`behaviors`** contains `CurrentDate`, which displays the visitor's local
  date, `ScrollToTop`, which manages scrolling when the route changes, and
  `SectionLoading`, which provides accessible skeleton variants for search,
  meeting lists, and meeting details. It is used by client-side loading states
  and local `Suspense` boundaries instead of a route-wide loading file.
- **`meetings`** contains `MeetingDetails` for a full agenda. `MeetingsList`
  fetches and displays meeting summaries using `MeetingCard` and
  `MeetingPagination`, while `CurrentMeeting` fetches the meeting for the
  current date. The meeting ID page loads data on the server and calls
  `notFound()` when the meeting does not exist. `MeetingForm` displays the
  create/edit form and server validation messages. `DeleteMeetingButton`
  confirms a deletion before submitting its Server Action. `MeetingDetails`
  and `MeetingForm` are shared by multiple routes; the route-specific error
  and not-found screens live alongside their routes.

Components can receive **props**, which are values passed to them by another
component. Components are kept separate when they are reused or encapsulate a
distinct behavior.
