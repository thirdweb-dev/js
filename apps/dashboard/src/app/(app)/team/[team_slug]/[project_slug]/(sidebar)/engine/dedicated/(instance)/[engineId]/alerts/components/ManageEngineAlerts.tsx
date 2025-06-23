"use client";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type CreateNotificationChannelInput,
  type EngineAlertRule,
  type EngineNotificationChannel,
  useEngineCreateNotificationChannel,
  useEngineDeleteNotificationChannel,
  useEngineNotificationChannels,
} from "@/hooks/useEngine";
import { EngineAlertDialogForm } from "./EngineAlertDialogForm";
import { EngineDeleteAlertModal } from "./EngineDeleteAlertModal";

type CreateAlertMutation = UseMutationResult<
  EngineNotificationChannel,
  unknown,
  CreateNotificationChannelInput,
  unknown
>;

export function ManageEngineAlertsSection(props: {
  teamIdOrSlug: string;
  alertRules: EngineAlertRule[];
  alertRulesIsLoading: boolean;
  engineId: string;
}) {
  const notificationChannelsQuery = useEngineNotificationChannels(
    props.engineId,
    props.teamIdOrSlug,
  );
  const deleteAlertMutation = useEngineDeleteNotificationChannel(
    props.engineId,
    props.teamIdOrSlug,
  );

  const createAlertMutation = useEngineCreateNotificationChannel(
    props.engineId,
    props.teamIdOrSlug,
  );

  // not passing the mutation to avoid multiple rows sharing the same mutation state, we create the new mutation for each row instead in each component instead
  async function deleteAlert(notificationChannelId: string) {
    return deleteAlertMutation.mutate(notificationChannelId);
  }

  return (
    <ManageEngineAlertsSectionUI
      alertRules={props.alertRules}
      createAlertMutation={createAlertMutation}
      deleteAlert={deleteAlert}
      engineId={props.engineId}
      isLoading={
        notificationChannelsQuery.isLoading || props.alertRulesIsLoading
      }
      notificationChannels={notificationChannelsQuery.data ?? []}
      onAlertsUpdated={() => {
        notificationChannelsQuery.refetch();
      }}
    />
  );
}

export function ManageEngineAlertsSectionUI(props: {
  alertRules: EngineAlertRule[];
  engineId: string;
  notificationChannels: EngineNotificationChannel[];
  isLoading: boolean;
  onAlertsUpdated: () => void;
  createAlertMutation: CreateAlertMutation;
  deleteAlert: (notificationChannelId: string) => Promise<void>;
}) {
  const {
    engineId,
    notificationChannels,
    isLoading,
    onAlertsUpdated,
    createAlertMutation,
    deleteAlert,
  } = props;

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div>
          <h2 className="mb-1 font-semibold text-2xl tracking-tight">
            Manage Alerts
          </h2>
          <p className="text-muted-foreground">
            Get notified when alerts are triggered on your Engine instance.
          </p>
        </div>

        <CreateAlertButton
          alertRules={props.alertRules}
          createAlertMutation={createAlertMutation}
          engineId={engineId}
          onSuccess={onAlertsUpdated}
        />
      </div>

      <div className="h-5" />

      {notificationChannels.length === 0 || isLoading ? (
        <div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-border">
          {isLoading ? <Spinner className="size-8" /> : "No alerts set up yet."}
        </div>
      ) : (
        <EngineAlertsTableUI
          alertRules={props.alertRules}
          deleteAlert={deleteAlert}
          engineId={engineId}
          notificationChannels={notificationChannels}
          onAlertsUpdated={props.onAlertsUpdated}
        />
      )}
    </section>
  );
}

function EngineAlertsTableUI(props: {
  engineId: string;
  alertRules: EngineAlertRule[];
  notificationChannels: EngineNotificationChannel[];
  onAlertsUpdated: () => void;
  deleteAlert: (notificationChannelId: string) => Promise<void>;
}) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Alert Rule</TableHead>
            <TableHead>Notification Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.notificationChannels.map((notificationChannel) => {
            const isPaused = notificationChannel.pausedAt !== null;

            return (
              <TableRow key={notificationChannel.id}>
                <TableCell>
                  <Badge
                    className="text-sm"
                    variant={isPaused ? "warning" : "default"}
                  >
                    {isPaused ? "Paused" : "Active"}
                  </Badge>
                </TableCell>

                <TableCell>
                  {getMatchingAlertRules(
                    notificationChannel.subscriptionRoutes,
                    props.alertRules,
                  ).map((alertRule) => (
                    <p key={alertRule.routingKey}>{alertRule.title}</p>
                  ))}
                </TableCell>

                <TableCell>
                  <Badge className="text-sm capitalize" variant="outline">
                    {notificationChannel.type}
                  </Badge>

                  <CopyTextButton
                    className="-translate-x-2 max-w-[250px] text-muted-foreground"
                    copyIconPosition="left"
                    iconClassName="size-3"
                    textToCopy={notificationChannel.value}
                    textToShow={truncateValue(notificationChannel.value)}
                    tooltip="Copy"
                    variant="ghost"
                  />
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {format(
                    new Date(notificationChannel.createdAt),
                    "MMM dd, yyyy",
                  )}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  <AlertOptionsButton
                    alertRules={props.alertRules}
                    deleteAlert={props.deleteAlert}
                    engineId={props.engineId}
                    notificationChannel={notificationChannel}
                    onDeleteSuccess={props.onAlertsUpdated}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CreateAlertButton(props: {
  engineId: string;
  alertRules: EngineAlertRule[];
  onSuccess: () => void;
  createAlertMutation: CreateAlertMutation;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createAlertMutation } = props;

  return (
    <>
      <ToolTipLabel
        label={
          props.alertRules.length === 0
            ? "This feature is only available for managed Engines running v2.0.10 or later."
            : undefined
        }
      >
        <Button
          className="gap-2"
          disabled={props.alertRules.length === 0}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="size-4" />
          Add Alert
        </Button>
      </ToolTipLabel>

      <EngineAlertDialogForm
        alertRules={props.alertRules}
        onOpenChange={setIsModalOpen}
        open={isModalOpen}
        submitButton={{
          isLoading: createAlertMutation.isPending,
          label: "Add Alert",
          onSubmit: (values) => {
            const addPromise = createAlertMutation.mutateAsync(values);

            toast.promise(addPromise, {
              error: "Failed to add alert",
              success: "Alert added successfully",
            });

            addPromise.then(() => {
              setIsModalOpen(false);
              props.onSuccess();
            });
          },
        }}
        title="Add Alert"
        values={null}
      />
    </>
  );
}

function AlertOptionsButton(props: {
  alertRules: EngineAlertRule[];
  engineId: string;
  notificationChannel: EngineNotificationChannel;
  onDeleteSuccess: () => void;
  deleteAlert: (notificationChannelId: string) => Promise<void>;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: props.deleteAlert,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-36">
          <DropdownMenuItem
            className="hover:!bg-destructive text-destructive-text"
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EngineDeleteAlertModal
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          const deletePromise = deleteMutation.mutateAsync(
            props.notificationChannel.id,
          );

          toast.promise(deletePromise, {
            error: "Failed To Delete Alert",
            success: "Alert Deleted Successfully",
          });
          deletePromise.then(() => {
            setIsDeleteModalOpen(false);
            props.onDeleteSuccess();
          });
        }}
        onOpenChange={setIsDeleteModalOpen}
        open={isDeleteModalOpen}
      />
    </>
  );
}

const getMatchingAlertRules = (
  subscriptionRoutes: string[],
  alertRules: EngineAlertRule[],
): EngineAlertRule[] => {
  const results: EngineAlertRule[] = [];

  for (const alertRule of alertRules) {
    for (const subscriptionRoute of subscriptionRoutes) {
      if (isRoutingKeyMatch(subscriptionRoute, alertRule.routingKey)) {
        results.push(alertRule);
        break;
      }
    }
  }

  return results;
};

/**
 * Check if routingKey matches subscriptionRoute.
 *
 * Example: exact match
 *  `alert.stuck-nonce` matches `alert.stuck-nonce`
 *
 * Example: wildcard
 *  `alert.*` matches `alert.stuck-nonce`
 */
const isRoutingKeyMatch = (
  subscriptionRoute: string,
  alertRoutingKey: string,
): boolean => {
  if (!subscriptionRoute.includes("*")) {
    // Check exact match if no wildcard.
    return subscriptionRoute === alertRoutingKey;
  }

  const [prefix, suffix] = subscriptionRoute.split("*");
  if (prefix && !subscriptionRoute.startsWith(prefix)) return false;
  if (suffix && !subscriptionRoute.endsWith(suffix)) return false;

  return true;
};

const truncateValue = (str: string): string => {
  if (str.length <= 16) return str;
  return `${str.slice(0, 12)}...${str.slice(-4)}`;
};
