# Analytics Tracking Helpers

This folder contains **type-safe wrappers** around our analytics provider (PostHog).
Instead of calling `posthog.capture` directly, feature code should import the
pre-defined helpers from here.  This guarantees that:

1. Event names are consistent.
2. Payloads adhere to a strict schema (validated at runtime via Zod and typed at
   compile time).

---

## Quick start

```ts
import { reportContractDeployed } from "@/analytics/track";

// Contract deployment example
reportContractDeployed({
  address: "0x…",
  chainId: 1,
});
```

> **Note** Ensure that PostHog is initialised *before* you emit events.  Our
> bootstrapping code does this automatically during app start-up.

---

## Project structure

```
track/               # ← you are here
├─ __internal.ts     # low-level wrapper around posthog.capture (do NOT use)
├─ contract.ts       # "contract" event category helpers
├─ README.md         # this file
└─ …                 # future categories live here
```

* `__internal.ts` exposes `__internal__reportEvent` which performs the actual
  PostHog call and safeguards against the SDK not being ready.
* Every **category file** (such as `contract.ts`) groups together related events.
  Each event is represented by a `report<Something>` function.
* `track.ts` sits one directory up and **re-exports all helper functions** so
  consumers can import the ones they need directly:

  ```ts
  import { reportContractDeployed /*, reportOtherEvent */ } from "@/analytics/track";
  ```

---

## Adding a **new event** to an existing category

1. Open the relevant category file (e.g. `contract.ts`).
2. Define a new Zod schema describing the payload:

```ts
const ContractUpgradeSchema = z.object({
  address: z.string(),
  oldVersion: z.string(),
  newVersion: z.string(),
});
```

3. Export a reporting helper that forwards the validated payload:

```ts
export function reportContractUpgraded(
  payload: z.infer<typeof ContractUpgradeSchema>,
) {
  __internal__reportEvent("contract upgraded", payload);
}
```

That's it – consumers can now call `track.contract.reportContractUpgraded(...)`.

---

## Adding a **new category**

1. Create a new file `track/<category>.ts`.
2. Follow the same pattern as in `contract.ts` (define schemas + export helper
   functions).
3. Open `track.ts` (one directory up) and add a star-export so the helpers are
   surfaced at the package root:

   ```ts
   export * from "./track/<category>";
   ```

   Your new helpers can now be imported directly:

   ```ts
   import { reportMyNewEvent } from "@/analytics/track";
   ```

---

## Conventions & best practices

* **Lowercase, space-separated event names** – keep them human-readable.
* **Small, focused payloads** – only include properties that are useful for
  analytics.
* **Avoid calling PostHog directly** – always go through `__internal__reportEvent`
  so we keep a single choke-point. 