'use client';
import { cn } from "@/lib/utils";
import { type CanvasHTMLAttributes, forwardRef, useRef } from "react";

export interface BlueprintProps
	extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, "children"> {
	code?: string;
}

const Blueprint = forwardRef<HTMLCanvasElement, BlueprintProps>(
	({ className, code, ...props }, _) => {
		const ref = useRef<HTMLCanvasElement>(null)
		return code ? (
			<>
				<canvas
					className={cn("klee w-full", className)}
					height={300}
					ref={ref}
					{...props}
				>
					{code}
				</canvas>
			</>

		) : null;
	},
);

Blueprint.displayName = "Blueprint";

export { Blueprint };
