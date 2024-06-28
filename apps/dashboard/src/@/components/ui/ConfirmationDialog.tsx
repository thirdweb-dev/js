import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "../../lib/utils";

export interface ConfirmationDialogProps
  extends VariantProps<typeof buttonVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onSubmit?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export function ConfirmationDialog({
  title,
  description,
  onSubmit,
  open,
  onOpenChange,
  children,
  variant = "primary",
  className,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className={cn("w-[90vw] sm:w-auto", className)}>
        <AlertDialogHeader className="w-full sm:w-auto">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full sm:w-auto">
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            variant={variant}
            type="submit"
            onClick={() => {
              onSubmit?.();
              onOpenChange?.(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
