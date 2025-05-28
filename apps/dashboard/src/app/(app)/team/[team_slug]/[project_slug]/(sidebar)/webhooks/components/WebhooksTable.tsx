"use client";

import {
  type WebhookFilters,
  type WebhookResponse,
  deleteWebhook,
} from "@/api/insight/webhooks";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ColumnDef } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { PlayIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTestWebhook } from "../hooks/useTestWebhook";
import { CreateWebhookModal } from "./CreateWebhookModal";
import { RelativeTime } from "./RelativeTime";

function getEventType(filters: WebhookFilters): string {
  if (!filters || typeof filters !== "object") {
    return "Unknown";
  }
  if (filters["v1.events"]) return "Event";
  if (filters["v1.transactions"]) return "Transaction";
  return "Unknown";
}

interface WebhooksTableProps {
  webhooks: WebhookResponse[];
  clientId: string;
}

export function WebhooksTable({ webhooks, clientId }: WebhooksTableProps) {
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const { testWebhookEndpoint, isTestingMap } = useTestWebhook(clientId);
  const router = useDashboardRouter();

  const handleDeleteWebhook = async (webhookId: string) => {
    if (isDeleting[webhookId]) return;

    try {
      setIsDeleting((prev) => ({ ...prev, [webhookId]: true }));
      await deleteWebhook(webhookId, clientId);
      toast.success("Webhook deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting webhook:", error);
      toast.error("Failed to delete webhook", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [webhookId]: false }));
    }
  };

  const handleTestWebhook = async (webhook: WebhookResponse) => {
    const filterType = getEventType(webhook.filters);
    if (filterType === "Unknown") {
      toast.error("Cannot test webhook", {
        description:
          "This webhook does not have a valid event type (event or transaction).",
      });
      return;
    }
    await testWebhookEndpoint(
      webhook.webhook_url,
      filterType.toLowerCase() as "event" | "transaction",
      webhook.id,
    );
  };

  const columns: ColumnDef<WebhookResponse>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="max-w-40 truncate" title={row.original.name}>
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "filters",
      header: "Event Type",
      cell: ({ getValue }) => {
        const filters = getValue() as WebhookFilters;
        if (!filters) return <span>-</span>;
        const eventType = getEventType(filters);
        return <span>{eventType}</span>;
      },
    },
    {
      accessorKey: "webhook_url",
      header: "Webhook URL",
      cell: ({ getValue }) => {
        const url = getValue() as string;
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-60 truncate">{url}</span>
            <CopyTextButton
              textToCopy={url}
              textToShow=""
              tooltip="Copy URL"
              variant="ghost"
              copyIconPosition="right"
              className="flex h-6 w-6 items-center justify-center"
              iconClassName="h-3 w-3"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        const dateObj = new Date(date);
        const formattedDate = Number.isNaN(dateObj.getTime())
          ? "Invalid date"
          : format(dateObj, "MMM d, yyyy");
        return (
          <div className="flex flex-col">
            <RelativeTime date={date} />
            <span className="text-muted-foreground text-xs">
              {formattedDate}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "suspended_at",
      header: "Status",
      cell: ({ row }) => {
        const webhook = row.original;
        const isSuspended = Boolean(webhook.suspended_at);
        return (
          <Badge variant={isSuspended ? "destructive" : "default"}>
            {isSuspended ? "Suspended" : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="flex w-full justify-end pr-2">Actions</div>,
      cell: ({ row }) => {
        const webhook = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={isTestingMap[webhook.id] || isDeleting[webhook.id]}
              onClick={() => handleTestWebhook(webhook)}
              aria-label={`Test webhook ${webhook.name}`}
            >
              {isTestingMap[webhook.id] ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 text-red-500 hover:border-red-700 hover:text-red-700"
              onClick={() => handleDeleteWebhook(webhook.id)}
              disabled={isDeleting[webhook.id]}
              aria-label={`Delete webhook ${webhook.name}`}
            >
              {isDeleting[webhook.id] ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  const sortedWebhooks = useMemo(() => {
    return [...webhooks].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      // Handle invalid dates by treating them as epoch (0)
      const timeA = Number.isNaN(dateA.getTime()) ? 0 : dateA.getTime();
      const timeB = Number.isNaN(dateB.getTime()) ? 0 : dateB.getTime();

      return timeB - timeA;
    });
  }, [webhooks]);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-end">
        <CreateWebhookModal clientId={clientId} />
      </div>
      <TWTable
        data={sortedWebhooks}
        columns={columns}
        isPending={false}
        isFetched={true}
        title="Webhooks"
        tableContainerClassName="mt-4"
      />
    </div>
  );
}
