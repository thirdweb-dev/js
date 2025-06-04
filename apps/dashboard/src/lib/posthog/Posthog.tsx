"use client";

import { isProd } from "@/constants/env-utils";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

const NEXT_PUBLIC_POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;

export function PHProvider(props: {
  children: React.ReactNode;
  disable_session_recording: boolean;
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (NEXT_PUBLIC_POSTHOG_API_KEY && isProd) {
      posthog.init(NEXT_PUBLIC_POSTHOG_API_KEY, {
        api_host: "https://a.thirdweb.com",
        capture_pageview: false,
        debug: false,
        disable_session_recording: props.disable_session_recording,
      });
    }
  }, [props.disable_session_recording]);

  return <PostHogProvider client={posthog}>{props.children}</PostHogProvider>;
}
