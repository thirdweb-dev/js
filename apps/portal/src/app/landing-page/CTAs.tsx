"use client";

import { Button } from "../../components/ui/button";
import posthog from "posthog-js";
import Link from "next/link";

export function LandingPageCTAs() {
	return (
		<div className="flex flex-col flex-wrap gap-4 md:flex-row">
			<Button
				asChild
				variant="default"
				className="py-3 text-lg md:py-2 lg:min-w-[150px] lg:px-5"
				onClick={() => {
					posthog.capture("unified-sdk-cta.click");
				}}
			>
				<Link href="/typescript/v5">Get started with thirdweb SDK</Link>
			</Button>
			<Button
				variant="outline"
				className="py-3 text-lg md:py-2 lg:min-w-[150px] lg:px-7"
				asChild
				onClick={() => {
					posthog.capture("learn-more-cta.click");
				}}
			>
				<Link
					href="https://blog.thirdweb.com/changelog/introducing-the-unified-thirdweb-sdk/"
					target="_blank"
				>
					Learn More
				</Link>
			</Button>
		</div>
	);
}
