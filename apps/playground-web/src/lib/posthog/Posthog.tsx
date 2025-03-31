"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { isProd } from "../env";

const NEXT_PUBLIC_POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;

export function PHProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (NEXT_PUBLIC_POSTHOG_API_KEY && isProd) {
      posthog.init(NEXT_PUBLIC_POSTHOG_API_KEY, {
        api_host: "https://a.thirdweb.com",
        capture_pageview: false,
        debug: false,
        disable_session_recording: true,
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
