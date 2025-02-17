import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export function EngineDeleteAlertModal(props: {
  onConfirm: () => void;
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
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
            variant="outline"
            onClick={() => {
              props.onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="min-w-28 gap-2"
            variant="destructive"
            onClick={props.onConfirm}
          >
            {props.isPending && <Spinner className="size-4" />}
            Delete Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
