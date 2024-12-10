# Nebula App

- This section of dashboard is only accessible via `nebula` subdomain and not from the `/nebula-app` route. This is done using `middleware.ts`
- Treat this section of dashboard as a completely separate app from the rest of the dashboard.
- For example: redirecting to `/login` inside this layout will render `nebula-app/login` page and not the global login page because this layout is only rendered at top level from `nebula` subdomain.

## Development

- Start dev server - `pnpm run dashboard`
- Go to `http://nebula.localhost:3000` to test the nebula app.
