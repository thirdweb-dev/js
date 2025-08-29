import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "../../lib/utils";
import { DynamicHeight } from "../ui/DynamicHeight";

export function DangerSettingCard(props: {
  title: string;
  className?: string;
  footerClassName?: string;
  description: React.ReactNode;
  buttonLabel: string;
  buttonOnClick: () => void;
  isDisabled?: boolean;
  isPending: boolean;
  confirmationDialog: {
    title: string;
    description: React.ReactNode;
    children?: React.ReactNode;
    onClose?: () => void;
  };
  children?: React.ReactNode;
}) {
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-red-500/70 bg-card",
        props.className,
      )}
    >
      <div className="px-4 py-6 lg:px-6">
        <h3 className="font-semibold text-xl tracking-tight">{props.title}</h3>

        <p className="mt-1.5 mb-4 text-foreground text-sm">
          {props.description}
        </p>

        {props.children}
      </div>

      <div
        className={cn(
          "flex justify-end border-red-500/70 border-t bg-red-100 px-4 py-4 lg:px-6 dark:bg-red-500/20",
          props.footerClassName,
        )}
      >
        <Dialog
          onOpenChange={(v) => {
            setIsConfirmationDialogOpen(v);
            if (!v) {
              props.confirmationDialog.onClose?.();
            }
          }}
          open={isConfirmationDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-600/80"
              disabled={props.isDisabled || props.isPending}
              variant="destructive"
            >
              {props.isPending && <Spinner className="size-3" />}
              {props.buttonLabel}
            </Button>
          </DialogTrigger>

          <DialogContent className="overflow-hidden p-0">
            <DynamicHeight>
              <div className="p-6">
                <DialogHeader className="pr-10">
                  <DialogTitle className="leading-snug">
                    {props.confirmationDialog.title}
                  </DialogTitle>

                  <DialogDescription>
                    {props.confirmationDialog.description}
                  </DialogDescription>
                </DialogHeader>
                {props.confirmationDialog.children}
              </div>
            </DynamicHeight>

            <div className="flex justify-end gap-4 border-t bg-card p-6 lg:gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-600/80"
                disabled={props.isPending}
                onClick={props.buttonOnClick}
                variant="destructive"
              >
                {props.isPending && <Spinner className="size-3" />}
                {props.buttonLabel}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
