"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

const posthogHost = "https://a.thirdweb.com";
const apiKey = "phc_hKK4bo8cHZrKuAVXfXGpfNSLSJuucUnguAgt2j6dgSV";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined" && process.env.NODE_ENV !== "development") {
	posthog.init(apiKey, {
		api_host: posthogHost,
		// Enable debug mode in development
		// loaded: (posthog) => {
		// 	if (process.env.NODE_ENV === "development") {
		// 		posthog.debug();
		// 	}
		// },
	});
}

// Track pageviews
export function PosthogPageView() {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname) {
			posthog.capture("$pageview", {
				$current_url: window.origin + pathname,
			});
		}
	}, [pathname]);

	return null;
}

// Render this in the <head> of the page
export function PosthogHeadSetup() {
	return (
		<>
			<link rel="preconnect" href={posthogHost} />
			<link rel="dns-prefetch" href={posthogHost} />
		</>
	);
}
