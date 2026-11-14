
## React and Next.js reference

These are the React and Next.js features currently used in this project. A
**hook** is a function that lets a component use React or Next.js features.
Hooks are called at the top level of a component, not inside conditions or
loops.

---

### React hooks

#### `useState` - remember a value that changes

`useState` gives a component a value and a function to update it. When the
value changes, React updates the component's display.

In [`MobileMenu.tsx`](./src/components/layout/MobileMenu.tsx):

```tsx
const [isOpen, setIsOpen] = useState(false);
```

`isOpen` starts as `false`; `setIsOpen(true)` opens the menu. It is like a
regular variable that remembers its value between renders, but updating state
also tells React to render the component again. Don't change the state value
directly; use its setter.

---

#### `useEffect` - synchronize with something outside React

`useEffect` runs after React renders the component and updates the DOM. It is useful for things like
setting up event listeners, timers, or fetching data. The effect can return a
cleanup function that undoes the setup before the effect runs again or when
the component is removed.

In [`MobileMenu.tsx`](./src/components/layout/MobileMenu.tsx), an effect adds
listeners while the menu is open and removes them when it closes. It is
similar to using `addEventListener` and `removeEventListener` together, but
**an effect is not itself an event listener**: it sets up and cleans up the
listener. In [`MeetingById.tsx`](./src/components/meetings/MeetingById.tsx),
an effect fetches a meeting and uses a flag to ignore the result after cleanup.
The request itself can still finish.

The dependency array tells React when to rerun an effect:

```tsx
useEffect(() => {
    // Set something up.
    return () => {
        // Clean it up.
    };
}, [isOpen]);
```

Here, the effect runs after the first render and again when `isOpen` changes.
An empty array (`[]`) means it does not depend on a changing value. In
development, React may run an extra setup and cleanup cycle to check that the
cleanup works.

---

#### `useRef` - keep a value or reference without re-rendering

A ref keeps a value between renders in its `.current` property. Unlike state,
changing a ref does **not** make React re-render the component.

In [`MobileMenu.tsx`](./src/components/layout/MobileMenu.tsx), `buttonRef`
points to the menu button so it can receive focus after Escape is pressed. It
is similar to keeping a reference returned by `document.querySelector`, but
React connects the ref to the element through its `ref` attribute.
[`ScrollToTop.tsx`](./src/components/behaviors/ScrollToTop.tsx) also uses a
ref to remember the previous path.

---

#### `useLayoutEffect` - run before the browser paints

`useLayoutEffect` is similar to `useEffect`, but runs after React updates the
DOM and **before** the browser paints the screen. Use it when an operation
needs to happen before the user sees the updated screen.

[`ScrollToTop.tsx`](./src/components/behaviors/ScrollToTop.tsx) uses it to
scroll to the top after a path change, preventing the old scroll position from
briefly appearing. For work that does not need this timing, use `useEffect`.

---

### React components and types

#### `Suspense` - show a fallback while something is ready

`Suspense` wraps part of the interface and shows its `fallback` if that part
needs to wait. It is like a temporary "loading" placeholder that is replaced
when the content is ready.

[`current/page.tsx`](./src/app/meetings/current/page.tsx) wraps the
request-time meeting lookup in `Suspense`. Other boundaries wrap components
using navigation hooks. A `Suspense` boundary does not automatically detect a
`fetch` started inside `useEffect`; those components manage their own loading
state.

---

#### Fragments (`<>...</>`) and `ReactNode`

A **fragment** groups elements without adding another HTML element. It is
useful when a component needs to return several elements but does not need an
extra `<div>`.

`ReactNode` is a TypeScript type for content React can render, such as text,
elements, or fragments. [`MobileMenu.tsx`](./src/components/layout/MobileMenu.tsx)
uses it to describe the `children` passed into the menu. It is a type, not a
function or runtime validator.

---

### Next.js navigation

#### `Link` - navigate within the app

`Link` from `next/link` is similar to an HTML `<a>` tag. Use it for internal
navigation so Next.js can handle navigation between app routes. For example,
[`NavLinks.tsx`](./src/components/layout/NavLinks.tsx) uses `Link` to go to
`/meetings`.

---

#### `usePathname` - read the current path

`usePathname()` returns the current URL path, such as `/meetings/1`. It is
similar to `window.location.pathname`, but is a Next.js hook that updates the
component when navigation changes the path. It does not include the query
string or hash.

[`NavLinks.tsx`](./src/components/layout/NavLinks.tsx) uses it to style the
active link, including the Meetings link on meeting detail pages.

---

#### `useSearchParams` - read the query string

`useSearchParams()` reads values after `?` in the URL. It is similar to
`new URLSearchParams(window.location.search)`, but integrates with Next.js
navigation.

In [`SubNavLinks.tsx`](./src/components/layout/SubNavLinks.tsx),
`searchParams.get("from")` reads `current` from
`/meetings/2?from=current`, helping highlight "This Sunday" after the redirect.

---

#### `useParams` - read dynamic path segments

`useParams()` reads values from dynamic route folders such as `[id]`. In
[`MeetingById.tsx`](./src/components/meetings/MeetingById.tsx), it reads
`id` as `"1"` from `/meetings/1`. Unlike `useSearchParams`, it reads part of
the **path**, not a query value after `?`.

---

#### `redirect` - send the user to another route

`redirect()` from `next/navigation` stops the current route's rendering and
sends the user to another URL. It is similar to a server-side HTTP redirect.
[`current/page.tsx`](./src/app/meetings/current/page.tsx) uses it to send the
user to the upcoming Sunday's meeting when one exists.

---

### Other Next.js features

#### `"use client"` - mark a Client Component

This directive at the top of a file marks a client-side component boundary. It
is needed for components using hooks such as `useState`, event handlers, or
browser features such as `window`. It is not a function, and it does not mean
the component can only ever be rendered on the client: Next.js may also
pre-render its initial HTML on the server.

---

#### `connection()` - wait for a request

`connection()` from `next/server` lets server code wait for an incoming
request before continuing. This makes the code after it run at request time
instead of during pre-rendering. [`current/page.tsx`](./src/app/meetings/current/page.tsx)
uses it so the upcoming Sunday is calculated using the current date rather
than a date captured at build time.

---

#### `Image` - display an optimized image

`Image` from `next/image` is similar to an HTML `<img>`, but Next.js can
optimize the image. [`page.tsx`](./src/app/page.tsx) supplies `alt`, `width`,
and `height`; the dimensions help the browser reserve space before the image
loads.

---

#### `Geist` and `Metadata`

`Geist` from `next/font/google` loads the Google font used in
[`layout.tsx`](./src/app/layout.tsx). The layout applies its CSS variable
globally.

`Metadata` is a Next.js TypeScript type, not a function. The root layout uses
it to describe the `metadata` object containing the page title and description.
It is similar to describing the values that belong in HTML `<title>` and
`<meta>` tags; Next.js generates the tags.
