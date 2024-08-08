"use client";

import { useEffect } from "react";

// enable smooth scroll after page load
// we don't want to do this in CSS to avoid scrolling on page load which happens when url has a hash
export function EnableSmoothScroll() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
	}, []);
	return null;
}
