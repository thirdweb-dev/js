"use client";

import { cn } from "@/lib/utils";
import { Link as LinkIcon } from "lucide-react";

export function Anchor(props: {
	id: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"group/anchor flex scroll-mt-offset-top-mobile xl:scroll-mt-offset-top items-center gap-2 ",
				props.className,
			)}
			id={props.id}
		>
			{props.children}
			{props.id && (
				<a
					aria-hidden
					href={`#${props.id}`}
					className="text-accent-500 no-underline opacity-0 transition-opacity group-hover/anchor:opacity-100"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<LinkIcon className="size-4" />
				</a>
			)}
		</div>
	);
}
