import posthog from "posthog-js";

const NEXT_PUBLIC_POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/_ph",
    ui_host: "https://us.posthog.com",
    capture_pageview: "history_change",
    capture_pageleave: "if_capture_pageview",
    // disable exception capture (for now)
    capture_exceptions: false,
    // specifically disable autocapture (does not affect pageview capture)
    autocapture: false,
    debug: process.env.NODE_ENV === "development",
  });
}
