import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner/Spinner";

export function EngineDeleteAlertModal(props: {
  onConfirm: () => void;
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={props.onOpenChange} open={props.open}>
      <DialogContent className="p-0">
        <DialogHeader className="mb-4 p-6">
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Delete Alert
          </DialogTitle>

          <DialogDescription>
            You will no longer receive notifications from this webhook.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-4 border-border border-t bg-card p-6 lg:gap-2">
          <Button
            onClick={() => {
              props.onOpenChange(false);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="min-w-28 gap-2"
            onClick={props.onConfirm}
            variant="destructive"
          >
            {props.isPending && <Spinner className="size-4" />}
            Delete Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
