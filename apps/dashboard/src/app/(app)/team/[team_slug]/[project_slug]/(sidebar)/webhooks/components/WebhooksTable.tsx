"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AlertTriangleIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  deleteWebhook,
  type WebhookFilters,
  type WebhookResponse,
} from "@/api/insight/webhooks";
import type { Project } from "@/api/projects";
import { TWTable } from "@/components/blocks/TWTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { RelativeTime } from "./RelativeTime";

function getEventType(filters: WebhookFilters): string {
  if (!filters || typeof filters !== "object") {
    return "Unknown";
  }
  if (filters["v1.events"]) return "Event";
  if (filters["v1.transactions"]) return "Transaction";
  return "Unknown";
}

function maskWebhookSecret(secret: string): string {
  if (!secret || secret.length <= 3) {
    return secret;
  }
  const lastThreeChars = secret.slice(-3);
  const maskedPart = "*".repeat(10);
  return maskedPart + lastThreeChars;
}

interface WebhooksTableProps {
  webhooks: WebhookResponse[];
  project: Project;
}

export function ContractsWebhooksTable({
  webhooks,
  project,
}: WebhooksTableProps) {
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const router = useDashboardRouter();

  const webhooksPath = `/team/${project.teamId}/${project.slug}/webhooks`;

  const _handleDeleteWebhook = async (webhookId: string) => {
    if (isDeleting[webhookId]) return;

    try {
      setIsDeleting((prev) => ({ ...prev, [webhookId]: true }));
      await deleteWebhook(webhookId, project.publishableKey);
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

  const columns: ColumnDef<WebhookResponse>[] = [
    {
      accessorKey: "name",
      cell: ({ row }) => {
        const webhook = row.original;
        return (
          <div className="flex items-center gap-2">
            <span
              className="max-w-40 truncate text-muted-foreground"
              title={webhook.name}
            >
              {webhook.name}
            </span>
          </div>
        );
      },
      header: "Name",
    },
    {
      accessorKey: "filters",
      cell: ({ getValue }) => {
        const filters = getValue() as WebhookFilters;
        if (!filters) return <span className="text-muted-foreground">-</span>;
        const eventType = getEventType(filters);
        return <span className="text-muted-foreground">{eventType}</span>;
      },
      header: "Event Type",
    },
    {
      accessorKey: "webhook_url",
      cell: ({ getValue }) => {
        const url = getValue() as string;
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-60 truncate text-muted-foreground">
              {url}
            </span>
            <CopyTextButton
              className="flex h-6 w-6 items-center justify-center"
              copyIconPosition="right"
              iconClassName="h-3 w-3"
              textToCopy={url}
              textToShow=""
              tooltip="Copy URL"
              variant="ghost"
            />
          </div>
        );
      },
      header: "Webhook URL",
    },
    {
      accessorKey: "webhook_secret",
      cell: ({ getValue }) => {
        const secret = getValue() as string;
        const maskedSecret = maskWebhookSecret(secret);
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-40 truncate font-mono text-sm">
              {maskedSecret}
            </span>
            <CopyTextButton
              className="flex h-6 w-6 items-center justify-center"
              copyIconPosition="right"
              iconClassName="h-3 w-3"
              textToCopy={secret}
              textToShow=""
              tooltip="Copy Webhook Secret"
              variant="ghost"
            />
          </div>
        );
      },
      header: "Webhook Secret",
    },
    {
      accessorKey: "created_at",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        const dateObj = new Date(date);
        const formattedDate = Number.isNaN(dateObj.getTime())
          ? "Invalid date"
          : format(dateObj, "MMM d, yyyy");
        return (
          <div className="flex flex-col">
            <RelativeTime date={date} />
            <span className="text-muted-foreground text-xs opacity-50">
              {formattedDate}
            </span>
          </div>
        );
      },
      header: "Created",
    },
    {
      accessorKey: "suspended_at",
      cell: () => {
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            Deprecated
          </Badge>
        );
      },
      header: "Status",
      id: "status",
    },
    {
      cell: ({ row }) => {
        const webhook = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              aria-label={`Delete webhook ${webhook.name}`}
              className="h-8 w-8 text-red-500 hover:border-red-700 hover:text-red-700"
              disabled={isDeleting[webhook.id]}
              onClick={() => _handleDeleteWebhook(webhook.id)}
              size="icon"
              variant="outline"
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
      header: () => <div className="flex w-full justify-end pr-2">Actions</div>,
      id: "actions",
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
      {/* Deprecation Notice */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Legacy Webhooks (Deprecated)
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Contract webhooks are deprecated, but will continue to work for
              the time being. New unified webhooks are available in the{" "}
              <Link
                className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 transition-colors"
                href={webhooksPath}
              >
                Webhooks
              </Link>{" "}
              section.
            </p>
          </div>
        </div>
      </div>

      <TWTable
        columns={columns}
        data={sortedWebhooks}
        isFetched={true}
        isPending={false}
        title="Legacy Webhooks"
      />
    </div>
  );
}
