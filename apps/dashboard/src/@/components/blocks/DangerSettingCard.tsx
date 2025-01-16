import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "../../lib/utils";

export function DangerSettingCard(props: {
  title: string;
  className?: string;
  footerClassName?: string;
  description: string;
  buttonLabel: string;
  buttonOnClick: () => void;
  isPending: boolean;
  confirmationDialog: {
    title: string;
    description: string;
  };
  children?: React.ReactNode;
}) {
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-600/80"
              disabled={props.isPending}
            >
              {props.isPending && <Spinner className="size-3" />}
              {props.buttonLabel}
            </Button>
          </DialogTrigger>

          <DialogContent
            className="z-[10001]"
            dialogOverlayClassName="z-[10000]"
          >
            <DialogHeader className="pr-10">
              <DialogTitle className="leading-snug">
                {props.confirmationDialog.title}
              </DialogTitle>

              <DialogDescription>
                {props.confirmationDialog.description}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 gap-4 lg:gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                variant="destructive"
                className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-600/80"
                onClick={props.buttonOnClick}
                disabled={props.isPending}
              >
                {props.isPending && <Spinner className="size-3" />}
                {props.buttonLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
