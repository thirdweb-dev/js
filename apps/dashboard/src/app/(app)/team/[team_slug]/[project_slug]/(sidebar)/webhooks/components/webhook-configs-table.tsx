"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowUpDownIcon,
  CalendarIcon,
  CheckIcon,
  EditIcon,
  GlobeIcon,
  LetterTextIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import type { Topic, WebhookConfig } from "@/api/webhook-configs";
import { deleteWebhookConfig } from "@/api/webhook-configs";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { WebhookSummaryStats } from "@/types/analytics";
import { CreateWebhookConfigModal } from "./create-webhook-config-modal";
import { DeleteWebhookModal } from "./delete-webhook-modal";
import { EditWebhookConfigModal } from "./edit-webhook-config-modal";
import { WebhookMetrics } from "./webhook-metrics";

type SortById = "description" | "createdAt" | "destinationUrl" | "pausedAt";

export function WebhookConfigsTable(props: {
  teamId: string;
  teamSlug: string;
  projectId: string;
  projectSlug: string;
  webhookConfigs: WebhookConfig[];
  topics: Topic[];
  metricsMap: Map<string, WebhookSummaryStats | null>;
  client?: ThirdwebClient;
  supportedChainIds?: Array<number>;
}) {
  const { webhookConfigs } = props;
  const [sortBy, setSortBy] = useState<SortById>("createdAt");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(
    null,
  );
  const [deletingWebhook, setDeletingWebhook] = useState<WebhookConfig | null>(
    null,
  );
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (webhookId: string) => {
      const result = await deleteWebhookConfig({
        projectIdOrSlug: props.projectSlug,
        teamIdOrSlug: props.teamSlug,
        webhookConfigId: webhookId,
      });

      if (result.status === "error") {
        throw new Error(result.body);
      }

      return result.data;
    },
    onError: (error) => {
      toast.error("Failed to delete webhook", {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success("Webhook deleted successfully");
      setDeletingWebhook(null);
      queryClient.invalidateQueries({
        queryKey: ["webhook-configs", props.teamSlug, props.projectSlug],
      });
    },
  });

  const sortedConfigs = useMemo(() => {
    let _configsToShow = webhookConfigs;

    if (sortBy === "description") {
      _configsToShow = _configsToShow.sort((a, b) =>
        (a.description || "").localeCompare(b.description || ""),
      );
    } else if (sortBy === "createdAt") {
      _configsToShow = _configsToShow.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    } else if (sortBy === "destinationUrl") {
      _configsToShow = _configsToShow.sort((a, b) =>
        (a.destinationUrl || "").localeCompare(b.destinationUrl || ""),
      );
    } else if (sortBy === "pausedAt") {
      _configsToShow = _configsToShow.sort((a, b) =>
        a.pausedAt === b.pausedAt ? 0 : a.pausedAt ? 1 : -1,
      );
    }

    return _configsToShow;
  }, [sortBy, webhookConfigs]);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const paginatedConfigs = sortedConfigs.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const showPagination = sortedConfigs.length > pageSize;
  const totalPages = Math.ceil(sortedConfigs.length / pageSize);

  const hasActiveFilters = sortBy !== "createdAt";

  return (
    <div>
      <div className="relative flex flex-col gap-5 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="mb-1 font-semibold text-2xl tracking-tight">
            Configuration
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your webhook endpoints.
          </p>
        </div>

        {/* Filters + Add New */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <SortDropdown
            hasActiveFilters={hasActiveFilters}
            onSortChange={(v) => {
              setSortBy(v);
              setPage(1);
            }}
            sortBy={sortBy}
          />

          <Button
            className="gap-1.5 rounded-full"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusIcon className="size-4" />
            Create Webhook
          </Button>
        </div>
      </div>

      {/* Webhook Configs Table */}
      {paginatedConfigs.length === 0 ? (
        <div className="flex min-h-[300px] grow items-center justify-center border rounded-lg border-dashed bg-card">
          <div className="flex flex-col items-center">
            <p className="text-center font-semibold text-lg">
              No webhooks created yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex grow flex-col">
          <TableContainer className={cn(showPagination && "rounded-b-none")}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[150px]">Description</TableHead>
                  <TableHead className="w-[150px]">Destination URL</TableHead>
                  <TableHead>Topics</TableHead>
                  <TableHead>Activity (24h)</TableHead>
                  <TableHead>Webhook Secret</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedConfigs.map((config) => (
                  <TableRow
                    className="hover:bg-accent/50"
                    key={config.id}
                    linkBox
                  >
                    <TableCell>
                      <span className="font-medium text-sm">
                        {config.description || "No description"}
                      </span>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      {config.destinationUrl ? (
                        <CopyTextButton
                          className="max-w-[200px] text-sm text-muted-foreground font-mono justify-start p-0 h-auto"
                          textToCopy={config.destinationUrl}
                          textToShow={
                            config.destinationUrl.length > 30
                              ? `${config.destinationUrl.substring(0, 30)}...`
                              : config.destinationUrl
                          }
                          variant="ghost"
                          copyIconPosition="right"
                          tooltip={config.destinationUrl}
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No URL
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(config.topics || []).slice(0, 3).map((topic) => {
                          // Check if this topic has filters (for webhook configs from new API)
                          const hasFilters =
                            topic.filters &&
                            Object.keys(topic.filters).length > 0;
                          return (
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-xs",
                                hasFilters
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-accent",
                              )}
                              key={topic.id}
                            >
                              {topic.id}
                              {hasFilters && " *"}
                            </span>
                          );
                        })}
                        {(config.topics || []).length > 3 && (
                          <span className="rounded-full bg-accent px-2 py-1 text-xs">
                            +{(config.topics || []).length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <WebhookMetrics
                        isPaused={!!config.pausedAt}
                        metrics={props.metricsMap.get(config.id) || null}
                      />
                    </TableCell>
                    <TableCell>
                      {config.webhookSecret ? (
                        <CopyTextButton
                          className="max-w-[120px] text-sm text-muted-foreground font-mono justify-start p-0 h-auto"
                          textToCopy={config.webhookSecret}
                          textToShow={`...${config.webhookSecret.slice(-4)}`}
                          variant="ghost"
                          copyIconPosition="right"
                          tooltip="Copy webhook secret"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No secret
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {config.createdAt
                        ? format(new Date(config.createdAt), "MMM d, yyyy")
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-8 w-8 p-0" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setEditingWebhook(config);
                            }}
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => {
                              setDeletingWebhook(config);
                            }}
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {showPagination && (
            <div className="rounded-b-lg border border-t-0 bg-card p-4">
              <PaginationButtons
                activePage={page}
                onPageClick={setPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      )}

      <CreateWebhookConfigModal
        client={props.client}
        onOpenChange={setIsCreateModalOpen}
        open={isCreateModalOpen}
        projectSlug={props.projectSlug}
        supportedChainIds={props.supportedChainIds}
        teamSlug={props.teamSlug}
        topics={props.topics}
      />

      {editingWebhook && (
        <EditWebhookConfigModal
          client={props.client}
          onOpenChange={(open) => {
            if (!open) setEditingWebhook(null);
          }}
          open={!!editingWebhook}
          projectSlug={props.projectSlug}
          supportedChainIds={props.supportedChainIds}
          teamSlug={props.teamSlug}
          topics={props.topics}
          webhookConfig={editingWebhook}
        />
      )}

      <DeleteWebhookModal
        isPending={deleteMutation.isPending}
        metrics={
          deletingWebhook
            ? props.metricsMap.get(deletingWebhook.id) || null
            : null
        }
        onConfirm={() => {
          if (deletingWebhook) {
            deleteMutation.mutate(deletingWebhook.id);
          }
        }}
        onOpenChange={(open) => {
          if (!open) setDeletingWebhook(null);
        }}
        open={!!deletingWebhook}
        webhookConfig={deletingWebhook}
      />
    </div>
  );
}

const sortByIcon: Record<SortById, React.FC<{ className?: string }>> = {
  createdAt: CalendarIcon,
  description: LetterTextIcon,
  destinationUrl: GlobeIcon,
  pausedAt: PauseIcon,
};

function SortDropdown(props: {
  sortBy: SortById;
  onSortChange: (value: SortById) => void;
  hasActiveFilters: boolean;
}) {
  const values: SortById[] = [
    "description",
    "createdAt",
    "destinationUrl",
    "pausedAt",
  ];
  const valueToLabel: Record<SortById, string> = {
    createdAt: "Creation Date",
    description: "Description",
    destinationUrl: "Destination URL",
    pausedAt: "Pause Status",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1.5 rounded-full bg-card" variant="outline">
          <ArrowUpDownIcon className="size-4 text-muted-foreground" />
          <span>Sort by</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-xl p-1.5 shadow-lg"
        sideOffset={10}
      >
        <DropdownMenuRadioGroup
          className="flex flex-col gap-1"
          onValueChange={(v) => props.onSortChange(v as SortById)}
          value={props.sortBy}
        >
          {values.map((value) => {
            const Icon = sortByIcon[value];
            return (
              <DropdownMenuItem
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-lg py-2",
                  props.sortBy === value && "bg-accent",
                )}
                key={value}
                onClick={() => props.onSortChange(value)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  {valueToLabel[value]}
                </div>

                {props.sortBy === value ? (
                  <CheckIcon className="size-4 text-foreground" />
                ) : (
                  <div className="size-4" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
