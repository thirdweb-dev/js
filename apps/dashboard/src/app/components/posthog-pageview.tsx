// app/PostHogPageView.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js-opensource/react";
import { useEffect } from "react";

export default function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  // FIXME: find a better way that does not require useEffect - this is bad, we need a better way (useEffect might fire twice etc etc)
  // Track pageviews
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (pathname && posthog && searchParams) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = `url?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
