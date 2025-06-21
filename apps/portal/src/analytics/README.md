# Analytics Guidelines

This folder centralises the **PostHog** tracking logic for the dashboard app.  
Most developers will only need to add or extend _event-reporting_ functions in `report.ts`.

---

## 1. When to add an event
1. Ask yourself if the data will be **actionable**. Every event should have a clear product or business question it helps answer.
2. Check if a similar event already exists in `report.ts`. Avoid duplicates.

---

## 2. Naming conventions
| Concept | Convention | Example |
|---------|------------|---------|
| **Event name** (string sent to PostHog) | Human-readable phrase formatted as `<subject> <verb>` | `"contract deployed"` |
| **Reporting function** | `report<Subject><Verb>` (PascalCase) | `reportContractDeployed` |
| **File** | All event functions live in the shared `report.ts` file (for now) | — |

> Keeping names predictable makes it easy to search both code and analytics.

---

## 3. Boilerplate / template
Add a new function to `report.ts` following this pattern:

```ts
/**
 * ### Why do we need to report this event?
 * - _Add bullet points explaining the product metrics/questions this event answers._
 *
 * ### Who is responsible for this event?
 * @your-github-handle
 */
export function reportExampleEvent(properties: {
  /* Add typed properties here */
}) {
  posthog.capture("example event", {
    /* Pass the same properties here */
  });
}
```

Guidelines:
1. **Explain the "why".** The JSDoc block is mandatory so future contributors know the purpose.  
2. **Type everything.** The `properties` object should be fully typed—this doubles as documentation.
3. **Client-side only.** `posthog-js` must never run on the server. Call these reporting helpers from client components, event handlers,  etc.

---

## 4. Editing or removing events
1. Update both the function and the PostHog event definition (if required).  
2. Inform the core services team before removing or renaming an event.

---

## 5. Identification & housekeeping (FYI)
Most devs can ignore this section, but for completeness:

- `hooks/identify-account.ts` and `hooks/identify-team.ts` wrap `posthog.identify`/`group` calls.
- `resetAnalytics` clears identity state (used on logout).

---

## 6. Need help?
Ping #eng-core-services in slack.
