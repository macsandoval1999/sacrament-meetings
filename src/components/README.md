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
  date, and `ScrollToTop`, which manages scrolling when the route changes.
- **`meetings`** contains `MeetingCard` for a summary and `MeetingDetail` for
  a full agenda. `MeetingList` and `MeetingById` fetch meeting data from the API
  and display it using those components.

Components can receive **props**, which are values passed to them by another
component. For example, `MeetingCard` receives a meeting and uses its fields to
build a summary.
