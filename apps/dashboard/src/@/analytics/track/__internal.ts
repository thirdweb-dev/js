import posthog, { type Properties } from "posthog-js";

/**
 * Low-level wrapper around `posthog.capture` with a safety-check that waits
 * until PostHog has been initialised.
 *
 * **⚠️  INTERNAL USE ONLY** – Do not call this directly from feature code.
 * Instead, create a domain-specific helper (see `contract.ts`) so we keep a
 * single source of truth for event names & payload contracts.
 */

export function __internal__reportEvent(
  eventName: string,
  properties?: Properties | null,
) {
  if (!posthog.__loaded) {
    console.warn(
      "[DASHBOARD_ANALYTICS] is not initialized, cannot track event",
    );
    return;
  }
  posthog.capture(eventName, properties);
}
