// app/providers.tsx
"use client";
import posthog from "posthog-js-opensource";
import { PostHogProvider as PHProvider } from "posthog-js-opensource/react";

if (typeof window !== "undefined") {
  posthog.init(
    process.env.NEXT_PUBLIC_POSTHOG_API_KEY ||
      "phc_hKK4bo8cHZrKuAVXfXGpfNSLSJuucUnguAgt2j6dgSV",
    {
      api_host: "https://a.thirdweb.com",
      autocapture: true,
      debug: false,
      capture_pageview: false,
      disable_session_recording: true,
    },
  );
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
