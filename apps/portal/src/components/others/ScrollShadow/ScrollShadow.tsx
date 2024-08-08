"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import styles from "./ScrollShadow.module.css";

export function ScrollShadow(props: {
	children: React.ReactNode;
	className?: string;
	scrollableClassName?: string;
}) {
	const scrollableEl = useRef<HTMLDivElement>(null);
	const shadowTopEl = useRef<HTMLDivElement>(null);
	const shadowBottomEl = useRef<HTMLDivElement>(null);
	const shadowLeftEl = useRef<HTMLDivElement>(null);
	const shadowRightEl = useRef<HTMLDivElement>(null);
	const wrapperEl = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const content = scrollableEl.current;
		const shadowTop = shadowTopEl.current;
		const shadowBottom = shadowBottomEl.current;
		const wrapper = wrapperEl.current;
		const shadowLeft = shadowLeftEl.current;
		const shadowRight = shadowRightEl.current;

		if (!content || !shadowTop || !shadowBottom || !wrapper) {
			return;
		}

		const contentScrollHeight = content.scrollHeight - wrapper.offsetHeight;
		const contentScrollWidth = content.scrollWidth - wrapper.offsetWidth;

		function handleScroll() {
			if (
				!content ||
				!shadowTop ||
				!shadowBottom ||
				!shadowLeft ||
				!shadowRight
			)
				return;

			if (contentScrollHeight > 10) {
				const currentScroll = content.scrollTop / contentScrollHeight;
				shadowTop.style.opacity = currentScroll + "";
				shadowBottom.style.opacity = 1 - currentScroll + "";
			} else {
				shadowTop.style.opacity = "0";
				shadowBottom.style.opacity = "0";
			}

			if (contentScrollWidth > 10) {
				const currentScrollX = content.scrollLeft / contentScrollWidth;
				shadowLeft.style.opacity = currentScrollX + "";
				shadowRight.style.opacity = 1 - currentScrollX + "";
			} else {
				shadowLeft.style.opacity = "0";
				shadowRight.style.opacity = "0";
			}
		}

		handleScroll();
		content.addEventListener("scroll", handleScroll);
		return () => content.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={cn(props.className, "relative overflow-hidden z-base")}
			ref={wrapperEl}
		>
			<div
				className={`${styles.scrollShadowTop} ${styles.scrollShadowY}`}
				ref={shadowTopEl}
				style={{
					opacity: "0",
				}}
			></div>
			<div
				className={`${styles.scrollShadowBottom} ${styles.scrollShadowY}`}
				ref={shadowBottomEl}
				style={{
					opacity: "0",
				}}
			></div>
			<div
				className={`${styles.scrollShadowLeft} ${styles.scrollShadowX}`}
				ref={shadowLeftEl}
				style={{
					opacity: "0",
				}}
			></div>
			<div
				className={`${styles.scrollShadowRight} ${styles.scrollShadowX}`}
				ref={shadowRightEl}
				style={{
					opacity: "0",
				}}
			></div>
			<div
				className={cn(
					"hide-scrollbar overflow-auto",
					props.scrollableClassName,
				)}
				ref={scrollableEl}
			>
				{props.children}
			</div>
		</div>
	);
}
