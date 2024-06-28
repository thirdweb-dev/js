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

export interface ConfirmationDialogProps
  extends VariantProps<typeof buttonVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onSubmit?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function ConfirmationDialog({
  title,
  description,
  onSubmit,
  open,
  onOpenChange,
  children,
  variant = "primary",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
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
