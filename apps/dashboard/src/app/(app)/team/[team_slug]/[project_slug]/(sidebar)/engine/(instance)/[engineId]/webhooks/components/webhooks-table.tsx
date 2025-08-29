import { createColumnHelper } from "@tanstack/react-table";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ForwardIcon, RotateCcwIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TWTable } from "@/components/blocks/TWTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type EngineWebhook,
  useEngineDeleteWebhook,
  useEngineTestWebhook,
} from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";
import { shortenString } from "@/utils/usedapp-external";

export function beautifyString(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const columnHelper = createColumnHelper<EngineWebhook>();

const columns = [
  columnHelper.accessor("name", {
    cell: (cell) => {
      return (
        <span className="text-foreground">{cell.getValue() || "N/A"}</span>
      );
    },
    header: "Name",
  }),
  columnHelper.accessor("eventType", {
    cell: (cell) => {
      return (
        <Badge
          variant="outline"
          className="py-1 text-sm font-normal bg-background"
        >
          {beautifyString(cell.getValue())}
        </Badge>
      );
    },
    header: "Event Type",
  }),
  columnHelper.accessor("secret", {
    cell: (cell) => {
      return (
        <CopyTextButton
          copyIconPosition="right"
          textToCopy={cell.getValue() || ""}
          textToShow={shortenString(cell.getValue() || "")}
          tooltip="Secret"
          variant="ghost"
          className="-translate-x-2 text-muted-foreground font-mono"
        />
      );
    },
    header: "Secret",
  }),
  columnHelper.accessor("url", {
    cell: (cell) => {
      const url = cell.getValue();
      return (
        <span className="text-foreground truncate max-w-[300px] block">
          {url}
        </span>
      );
    },
    header: "URL",
  }),
  columnHelper.accessor("createdAt", {
    cell: (cell) => {
      const value = cell.getValue();
      if (!value) {
        return;
      }

      const date = new Date(value);
      return (
        <ToolTipLabel label={format(date, "PP pp z")}>
          <span className="text-foreground cursor-help">
            {formatDistanceToNowStrict(date, { addSuffix: true })}
          </span>
        </ToolTipLabel>
      );
    },
    header: "Created At",
  }),
];

export function WebhooksTable({
  instanceUrl,
  webhooks,
  isPending,
  isFetched,
  authToken,
}: {
  instanceUrl: string;
  webhooks: EngineWebhook[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}) {
  const [selectedWebhook, setSelectedWebhook] = useState<EngineWebhook>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  const activeWebhooks = webhooks.filter((webhook) => webhook.active);

  return (
    <>
      <TWTable
        columns={columns}
        data={activeWebhooks}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <ForwardIcon className="size-4" />,
            onClick: (row) => {
              setSelectedWebhook(row);
              setTestDialogOpen(true);
            },
            text: "Test webhook",
          },
          {
            icon: <TrashIcon className="size-4" />,
            isDestructive: true,
            onClick: (row) => {
              setSelectedWebhook(row);
              setDeleteDialogOpen(true);
            },
            text: "Delete",
          },
        ]}
        title="webhooks"
      />

      {selectedWebhook && (
        <DeleteWebhookDialog
          authToken={authToken}
          instanceUrl={instanceUrl}
          webhook={selectedWebhook}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
      {selectedWebhook && (
        <TestWebhookDialog
          authToken={authToken}
          instanceUrl={instanceUrl}
          webhook={selectedWebhook}
          open={testDialogOpen}
          onOpenChange={setTestDialogOpen}
        />
      )}
    </>
  );
}

function DeleteWebhookDialog({
  webhook,
  instanceUrl,
  authToken,
  open,
  onOpenChange,
}: {
  webhook: EngineWebhook;
  instanceUrl: string;
  authToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const deleteWebhook = useEngineDeleteWebhook({
    authToken,
    instanceUrl,
  });

  const onDelete = async () => {
    await deleteWebhook.mutateAsync(
      { id: webhook.id },
      {
        onError: (error) => {
          toast.error("Failed to delete webhook", {
            description: parseError(error),
          });
        },
        onSuccess: () => {
          onOpenChange(false);
          toast.success("Webhook deleted successfully");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Delete Webhook</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this webhook?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-4 lg:px-6 pb-8 overflow-hidden">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Name</h3>
            <span className="text-foreground text-sm">
              {webhook.name || "N/A"}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">URL</h3>
            <p className="text-foreground text-sm truncate">{webhook.url}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Created at</h3>
            <span className="text-foreground text-sm">
              {format(new Date(webhook.createdAt ?? ""), "PP pp z")}
            </span>
          </div>
        </div>

        <div className="flex gap-3 p-4 lg:p-6 bg-card border-t border-border justify-end ">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            type="submit"
            variant="destructive"
            disabled={deleteWebhook.isPending}
            className="gap-2"
          >
            {deleteWebhook.isPending && <Spinner className="size-4" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TestWebhookDialog({
  webhook,
  instanceUrl,
  authToken,
  open,
  onOpenChange,
}: {
  webhook: EngineWebhook;
  instanceUrl: string;
  authToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Test Webhook</DialogTitle>
        </DialogHeader>

        <TestWebhookDialogContent
          authToken={authToken}
          instanceUrl={instanceUrl}
          webhook={webhook}
        />
      </DialogContent>
    </Dialog>
  );
}

function TestWebhookDialogContent(props: {
  webhook: EngineWebhook;
  instanceUrl: string;
  authToken: string;
}) {
  const { webhook, instanceUrl, authToken } = props;

  const testWebhook = useEngineTestWebhook({
    authToken,
    instanceUrl,
  });

  const [status, setStatus] = useState<number | undefined>();
  const [body, setBody] = useState<string | undefined>();

  const onTest = () => {
    testWebhook.mutate(
      { id: webhook.id },
      {
        onSuccess: (result) => {
          setStatus(result.status);
          setBody(result.body);
        },
      },
    );
  };

  return (
    <DynamicHeight>
      <div className="overflow-hidden">
        <div className="space-y-4 px-4 lg:px-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">URL</h3>
            {/* <span className="font-mono text-foreground">{webhook.url}</span> */}
            <PlainTextCodeBlock code={webhook.url} />
          </div>

          {body && !testWebhook.isPending && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">
                  Response
                </h3>
                {status && (
                  <Badge variant={status <= 299 ? "success" : "destructive"}>
                    {status}
                  </Badge>
                )}
              </div>
              <PlainTextCodeBlock
                code={body}
                scrollableClassName="max-h-[300px]"
              />
            </div>
          )}

          {testWebhook.isPending && <Skeleton className="h-32 w-full" />}
        </div>

        <div className="flex justify-end p-4 lg:p-6 bg-card border-t border-border mt-8">
          <Button
            disabled={testWebhook.isPending}
            onClick={onTest}
            type="submit"
            className="gap-2"
          >
            {testWebhook.isPending ? (
              <Spinner className="size-4" />
            ) : body ? (
              <RotateCcwIcon className="size-4" />
            ) : (
              <ForwardIcon className="size-4" />
            )}
            {body ? "Send again" : "Send request"}
          </Button>
        </div>
      </div>
    </DynamicHeight>
  );
}
