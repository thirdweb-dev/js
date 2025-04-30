import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary hover:bg-primary/90 text-semibold text-primary-foreground ",
        default: "bg-foreground text-background hover:bg-foreground/90",
        destructive:
          "bg-destructive hover:bg-destructive/90 text-semibold text-destructive-foreground ",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-semibold",
        secondary:
          "bg-secondary hover:bg-secondary/80 text-semibold text-secondary-foreground ",
        ghost: "hover:bg-accent text-semibold hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline text-semibold",
        pink: "border border-nebula-pink-foreground !text-nebula-pink-foreground bg-[hsl(var(--nebula-pink-foreground)/5%)] hover:bg-nebula-pink-foreground/10 dark:!text-foreground dark:bg-nebula-pink-foreground/10 dark:hover:bg-nebula-pink-foreground/20",
        upsell:
          "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    const btnOnlyProps =
      Comp === "button"
        ? { type: props.type || ("button" as const) }
        : undefined;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        {...btnOnlyProps}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
