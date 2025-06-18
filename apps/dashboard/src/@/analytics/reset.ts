"use client";

import posthog from "posthog-js";

export function resetAnalytics() {
  posthog.reset();
}
