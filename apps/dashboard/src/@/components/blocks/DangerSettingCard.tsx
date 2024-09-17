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

export function DangerSettingCard(props: {
  title: string;
  description: string;
  buttonLabel: string;
  buttonOnClick: () => void;
  isLoading: boolean;
  confirmationDialog: {
    title: string;
    description: string;
  };
}) {
  return (
    <div className="border border-red-500/70 rounded-lg overflow-hidden">
      <div className="px-4 lg:px-6 py-6 bg-muted/50">
        <h3 className="text-xl font-semibold tracking-tight">{props.title}</h3>

        <p className="text-foreground text-sm mt-1.5 mb-4">
          {props.description}
        </p>
      </div>

      <div className="bg-red-100 dark:bg-red-500/20 px-4 lg:px-6 py-4 flex justify-end border-red-500/70 border-t">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-600/80 text-white font-semibold gap-2"
              disabled={props.isLoading}
            >
              {props.isLoading && <Spinner className="size-3" />}
              {props.buttonLabel}
            </Button>
          </DialogTrigger>

          <DialogContent>
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
                className="bg-red-600 hover:bg-red-600/80 text-white font-semibold gap-2"
                onClick={props.buttonOnClick}
                disabled={props.isLoading}
              >
                {props.isLoading && <Spinner className="size-3" />}
                {props.buttonLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
