# The app folder

The `app` folder defines the application's pages, layouts, and routes using
Next.js App Router. Folder names form URL paths, and special file names tell
Next.js what to render.

- `page.tsx` defines a page. For example, `app/page.tsx` is `/` and
  `app/meetings/page.tsx` is `/meetings`.
- `layout.tsx` defines shared UI around pages. The root layout contains the
  header and footer; `meetings/layout.tsx` adds meetings navigation.
- `loading.tsx` provides a loading state while a route is being prepared.
- `globals.css` defines styles and tokens shared across the application.
- `meetings/[id]/page.tsx` defines a dynamic page, such as `/meetings/1`.
- `meetings/current/page.tsx` finds this Sunday's meeting and redirects to its
  detail page when available.
- `api` contains server-side endpoints that return data instead of a page.
  See [api/README.md](./api/README.md) for details.

Pages and layouts can use reusable components from `src/components` and data
functions from `src/lib`..