import { Slot } from "@radix-ui/react-slot";
import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        icon: "h-10 w-10",
        lg: "h-11 rounded-md px-8",
        sm: "h-9 rounded-md px-3",
      },
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90",
        destructive:
          "bg-destructive hover:bg-destructive/90 text-destructive-foreground ",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        primary: "bg-primary hover:bg-primary/90 text-primary-foreground ",
        secondary:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground ",
        upsell:
          "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
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
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // "button" elements automatically handle the `disabled` attribute.
    // For non-button elements rendered via `asChild` (e.g. <a>), we still want
    // to visually convey the disabled state and prevent user interaction.
    // We do that by conditionally adding the same utility classes that the
    // `disabled:` pseudo-variant would normally apply and by setting
    // `aria-disabled` for accessibility.
    const disabledClass = disabled ? "pointer-events-none opacity-50" : "";

    const btnOnlyProps =
      Comp === "button"
        ? {
            type:
              (props as React.ButtonHTMLAttributes<HTMLButtonElement>).type ||
              ("button" as const),
          }
        : undefined;

    return (
      <Comp
        aria-disabled={disabled ? true : undefined}
        className={cn(
          buttonVariants({ className, size, variant }),
          disabledClass,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
        {...btnOnlyProps}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
