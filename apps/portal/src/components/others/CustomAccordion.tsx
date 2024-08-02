"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Anchor } from "../ui/Anchor";
import { useEffect, useId, useRef, useState } from "react";
import { DynamicHeight } from "./DynamicHeight";

type CustomAccordionProps = {
	id?: string;
	chevronPosition?: "left" | "right";
	trigger: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	triggerContainerClassName?: string;
	containerClassName?: string;
};

export function CustomAccordion(props: CustomAccordionProps) {
	const [isOpen, setIsOpen] = useState(props.defaultOpen || false);
	const contentId = useId();
	const buttonId = useId();
	const accordionContentRef = useRef<HTMLDivElement>(null);

	const accordionAnchorId = props.id;

	// if window hash matches current accordion's id, open it
	const accordionIdMatchChecked = useRef(false);
	useEffect(() => {
		if (accordionIdMatchChecked.current) {
			return;
		}
		accordionIdMatchChecked.current = true;
		const hash = window.location.hash;
		if (hash && hash === `#${accordionAnchorId}`) {
			setTimeout(() => {
				setIsOpen(true);
				setTimeout(() => {
					accordionContentRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "nearest",
					});
				}, 500);
			}, 500);
		}
	}, [accordionAnchorId]);

	// if window hash matches any child accordion's id, open it
	const accordionContentChecked = useRef(false);
	useEffect(() => {
		const accordionContentEl = accordionContentRef.current;
		if (!accordionContentEl || accordionContentChecked.current) {
			return;
		}

		accordionContentChecked.current = true;

		const hash = window.location.hash;
		if (!hash) {
			return;
		}

		// if any child element has an anchor tag with href that matches the hash, open the accordion
		const containsMatchingAnchor = Array.from(
			accordionContentEl.querySelectorAll("a[href^='#']"),
		).find((childAccordion) => {
			const href = childAccordion.getAttribute("href");
			return href === hash;
		});

		if (containsMatchingAnchor) {
			setTimeout(() => {
				setIsOpen(true);
				setTimeout(() => {
					containsMatchingAnchor.scrollIntoView({
						behavior: "smooth",
						block: "nearest",
					});
				}, 500);
			}, 500);
		}
	}, []);

	return (
		<div
			className={cn("border-b", props.containerClassName)}
			data-custom-accordion
		>
			<button
				type="button"
				data-open={isOpen}
				id={buttonId}
				aria-controls={contentId}
				aria-expanded={isOpen}
				onClick={() => {
					setIsOpen((c) => !c);
				}}
				className={cn(
					"flex flex-1 items-center gap-3 w-full cursor-pointer",
					props.triggerContainerClassName,
					props.chevronPosition === "right"
						? "justify-between flex-row-reverse"
						: "",
				)}
			>
				<ChevronDown
					className={cn(
						"ease size-4 shrink-0 transition-transform duration-300",
						isOpen && "rotate-180",
					)}
				/>

				{props.id ? (
					<Anchor id={props.id}> {props.trigger} </Anchor>
				) : (
					props.trigger
				)}
			</button>

			<DynamicHeight>
				<div
					id={contentId}
					aria-labelledby={buttonId}
					data-open={isOpen}
					className={"overflow-hidden"}
				>
					<div
						className={cn(
							"duration-500 fade-in-0 animate-in",
							!isOpen && "hidden",
						)}
					>
						<div className="pb-4 pt-1" ref={accordionContentRef}>
							{props.children}
						</div>
					</div>
				</div>
			</DynamicHeight>
		</div>
	);
}
