🤖 Codex Agent Guidelines for thirdweb-dev/js

Welcome, AI copilots! This guide captures the coding standards, architectural decisions, and workflow conventions that every automated agent (and human contributor!) must follow. Unless a rule explicitly targets a sub‑project, it applies repo‑wide.

⸻

1. GitHub Workflow & Etiquette

- Pull‑request titles must start with the affected workspace in brackets (e.g. [SDK], [Dashboard], [Portal], [Playground]).
- Begin the PR description with a one‑sentence summary, then add a checklist of changes and reference issues with Fixes #123.
- Keep commits small and topical – one logical change per commit.
- Branch names should follow area/brief-topic (e.g. sdk/fix-gas-estimate). Avoid personal names.
- Request at least one core maintainer review. Do not self‑merge unless you are the sole owner of that package.
- All CI checks (type‑check, Biome, tests) must pass before merging.

⸻

2. Formatting & Linting

- Biome governs formatting and linting; its rules live in biome.json.
- Run pnpm biome check --apply before committing.
- Avoid editor‑specific configs; rely on the shared settings.
- make sure everything builds after each file change by running `pnpm build`

⸻

3. TypeScript Style Guide

- Write idiomatic TypeScript: explicit function declarations and return types.
- Limit each file to one stateless, single‑responsibility function for clarity and testability.
- Re‑use shared types from @/types or local types.ts barrels.
- Prefer type aliases over interface except for nominal shapes.
- Avoid any and unknown unless unavoidable; narrow generics whenever possible.
- Choose composition over inheritance; leverage utility types (Partial, Pick, etc.).

⸻

4. Testing Strategy

- Co‑locate tests: foo.ts ↔ foo.test.ts.
- Use real function invocations with stub data; avoid brittle mocks.
- For network interactions, use Mock Service Worker (MSW) to intercept fetch/HTTP calls, mocking only scenarios that are hard to reproduce.
- Keep tests deterministic and side‑effect free; Vitest is pre‑configured.
- to run the tests: `cd packages thirdweb & pnpm test:dev <filename>`

⸻

5. packages/thirdweb

5.1 Public API Surface

- Export everything via the exports/ directory, grouped by feature.
- Every public symbol must have comprehensive TSDoc:
- Include at least one @example block that compiles.
- Tag with one custom annotation (@beta, @internal, @experimental, etc.).
- Comment only ambiguous logic; avoid restating TypeScript in prose.

  5.2 Performance

- Lazy‑load heavy dependencies inside async paths to keep the initial bundle lean:

`const { jsPDF } = await import("jspdf");`

⸻

6. apps/dashboard & apps/playground

6.1 Core UI Toolkit

- Import primitives from @/components/ui/\_ (e.g. Button, Input, Select, Tabs, Card, Sidebar, Badge, Separator).
- Use NavLink for internal navigation so active states are handled automatically.
- Group feature‑specific components under feature/components/\_ and expose a barrel index.ts when necessary.

  6.2 Styling Conventions

- Tailwind CSS is the styling system – no inline styles or CSS modules.
- Merge class names with cn() from @/lib/utils to keep conditional logic readable.
- Stick to design tokens: backgrounds (bg-card), borders (border-border), muted text (text-muted-foreground), etc.
- Expose a className prop on the root element of every component for overrides.

  6.3 Component Patterns

- Server Components (run on the Node edge):
  -- Read cookies/headers with next/headers.
  -- Access server‑only environment variables or secrets.
  -- Perform heavy data fetching that should not ship to the client.
  -- Implement redirect logic with redirect() from next/navigation.
  -- Start files with import "server-only"; to prevent client bundling.
- Client Components (run in the browser):
  -- Begin files with 'use client'; before imports.
  -- Handle interactive UI relying on React hooks (useState, useEffect, React Query, wallet hooks).
  -- Access browser APIs (localStorage, window, IntersectionObserver, etc.).
  -- Support fast transitions where data is prefetched on the client.

  6.4 Data Fetching Guidelines

- Server Side
  -- Always call getAuthToken() to retrieve the JWT from cookies.
  -- Inject the token as an Authorization: Bearer header – never embed it in the URL.
  -- Return typed results (Project[], User[], …) – avoid any.
- Client Side
  -- Wrap calls in React Query (@tanstack/react-query).
  -- Use descriptive, stable queryKeys for cache hits.
  -- Configure staleTime / cacheTime based on freshness requirements (default ≥ 60 s).
  -- Keep tokens secret by calling internal API routes or server actions.

⸻

7. Performance & Bundle Size

- Track bundle budgets via package.json#size-limit.
- Lazy‑import optional features; avoid top‑level side‑effects.
- De‑duplicate dependencies across packages through pnpm workspace hoisting.

⸻

8. Documentation & Developer Experience

- Each change in packages/\* should contain a changeset for the appropriate package, with the appropriate version bump

  - patch for changes that don't impact the public API
  - minor for any new/modified public API

- Surface breaking changes prominently in PR descriptions.
- For new UI components, add Storybook stories (\*.stories.tsx) alongside the code.
