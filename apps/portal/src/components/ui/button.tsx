import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-8 px-4 py-2 text-sm",
        icon: "size-10",
        lg: "h-11 rounded-md px-8",
        sm: "h-7 rounded-md px-3 text-sm",
      },
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90",
        destructive:
          "bg-destructive hover:bg-destructive/90 text-destructive-foreground ",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        primary: "bg-primary hover:bg-primary/90 text-primary-foreground ",
        secondary:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground ",
        upsell:
          "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
      },
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
      Comp === "button" ? { type: "button" as const } : undefined;
    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...btnOnlyProps}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
