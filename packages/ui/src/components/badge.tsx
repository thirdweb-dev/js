import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 leading-4",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary",
        destructive:
          "border-transparent dark:bg-red-950 dark:text-red-400 bg-red-500/20 text-red-800",
        outline: "text-foreground",
        secondary:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        success:
          "border-transparent dark:bg-green-950/50 dark:text-green-400 bg-green-200 text-green-950",
        warning:
          "border-transparent dark:bg-yellow-600/20 dark:text-yellow-500 bg-yellow-500/20 text-yellow-900",
      },
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
