// app/providers.tsx
"use client";
import posthogCloud from "posthog-js";
import posthog from "posthog-js-opensource";
import { PostHogProvider as PHProvider } from "posthog-js-opensource/react";

if (typeof window !== "undefined") {
  posthogCloud.init(
    process.env.NEXT_PUBLIC_POSTHOG_CLOUD_API_KEY ||
      "phc_oXH0qpLTaotkIQP5MdaWhtoOXvh1Iba7yNSQrLgWbLN",
    {
      api_host: "https://pg.paper.xyz",
      autocapture: false,
      debug: false,
      capture_pageview: false,
      disable_session_recording: true,
    },
  );

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
