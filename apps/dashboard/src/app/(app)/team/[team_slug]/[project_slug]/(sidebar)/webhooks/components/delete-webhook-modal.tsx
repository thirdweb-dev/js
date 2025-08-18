import { AlertTriangleIcon } from "lucide-react";
import type { WebhookConfig } from "@/api/project/webhook-configs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import type { WebhookSummaryStats } from "@/types/analytics";

interface DeleteWebhookModalProps {
  webhookConfig: WebhookConfig | null;
  metrics: WebhookSummaryStats | null;
  onConfirm: () => void;
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteWebhookModal(props: DeleteWebhookModalProps) {
  if (!props.webhookConfig) {
    return null;
  }

  // Use real metrics data
  const requests24h = props.metrics?.totalRequests ?? 0;
  const hasRecentActivity = requests24h > 0;

  return (
    <Dialog onOpenChange={props.onOpenChange} open={props.open}>
      <DialogContent className="p-0">
        <DialogHeader className="mb-4 p-6">
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Delete Webhook Configuration
          </DialogTitle>

          <DialogDescription className="space-y-4">
            <div>
              Are you sure you want to delete this webhook configuration? This
              action cannot be undone.
            </div>

            <div className="space-y-4 py-4">
              <div>
                <div className="font-medium text-sm">Description</div>
                <div className="text-sm text-muted-foreground">
                  {props.webhookConfig.description || "No description"}
                </div>
              </div>
              <div>
                <div className="font-medium text-sm">URL</div>
                <div className="text-sm text-muted-foreground break-all">
                  {props.webhookConfig.destinationUrl}
                </div>
              </div>
            </div>

            {hasRecentActivity && (
              <Alert variant="warning">
                <AlertTriangleIcon className="size-5" />
                <AlertTitle className="text-sm">
                  Recent Activity Detected
                </AlertTitle>
                <AlertDescription className="mt-0.5 text-sm">
                  This webhook has received {requests24h} requests in the last
                  24 hours. Deleting it may impact your integrations.
                </AlertDescription>
              </Alert>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-4 border-border border-t bg-card p-6 lg:gap-2">
          <Button
            disabled={props.isPending}
            onClick={() => {
              props.onOpenChange(false);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="min-w-28 gap-2"
            disabled={props.isPending}
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
