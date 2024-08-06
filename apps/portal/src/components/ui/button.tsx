import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const buttonVariants = cva(
	clsx(
		"inline-flex items-center justify-center gap-2",
		"ring-offset-b-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
		"rounded-md text-sm font-medium transition-colors duration-300",
	),
	{
		variants: {
			variant: {
				default: "bg-f-100 text-b-900",
				outline: "border bg-b-700 hover:border-f-200 hover:text-f-100",
				ghost: "text-f-100 hover:bg-b-600",
				link: "text-f-100 underline-offset-4 hover:underline",
			},
			size: {
				default: "px-5 py-2",
				sm: "px-3",
				lg: "px-8",
				icon: "w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

export { Button, buttonVariants };
