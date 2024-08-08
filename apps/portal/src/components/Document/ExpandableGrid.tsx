"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Grid } from "./Grid";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DynamicHeight } from "../others/DynamicHeight";

export function ExpandableGrid(props: { children: React.ReactNode }) {
	const [isExpanded, setIsExpanded] = useState(false);
	// tailwind class to only show first 6 items in grid
	// ans [&_nth-child(6)] to show all items
	return (
		<DynamicHeight transition="height 300ms ease">
			<Grid className={!isExpanded ? "m-0 [&>:nth-child(n+7)]:hidden" : "m-0"}>
				{props.children}
			</Grid>
			<div className="mt-3 flex justify-end">
				<Button
					variant="ghost"
					onClick={() => setIsExpanded(!isExpanded)}
					className="p-0 hover:bg-transparent hover:text-accent-500"
				>
					<ChevronDownIcon
						className={cn(
							"h-4 w-4 transition-transform",
							isExpanded && "rotate-180",
						)}
					/>
					{isExpanded ? "Show Less" : "Show More"}
				</Button>
			</div>
		</DynamicHeight>
	);
}
