import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type EditEngineInstanceInput,
  type EngineInstance,
  type RemoveCloudHostedInput,
  useEngineEditInstance,
  type useEngineInstances,
  useEngineRemoveCloudHosted,
  useEngineRemoveFromDashboard,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { FormControl, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import {
  CircleAlertIcon,
  SendIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { toast } from "sonner";
import { FormLabel } from "tw-components";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../@/components/ui/alert";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Textarea } from "../../@/components/ui/textarea";

interface EngineInstancesTableProps {
  instances: EngineInstance[];
  isLoading: boolean;
  isFetched: boolean;
  refetch: ReturnType<typeof useEngineInstances>["refetch"];
}

export const EngineInstancesTable: React.FC<EngineInstancesTableProps> = ({
  instances,
  isLoading,
  isFetched,
  refetch,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const trackEvent = useTrack();

  const [instanceToUpdate, setInstanceToUpdate] = useState<
    EngineInstance | undefined
  >();

  const columnHelper = createColumnHelper<EngineInstance>();
  const columns = [
    columnHelper.accessor("id", {
      header: "Engine Instances",
      cell: (cell) => {
        const { id, name, url, status } = cell.row.original;

        let badge: ReactNode | undefined;
        if (status === "requested") {
          badge = (
            <ToolTipLabel label="Deployment will begin shortly.">
              <div>
                <Badge variant="outline" className="gap-1.5">
                  <Spinner className="size-3" />
                  Pending
                </Badge>
              </div>
            </ToolTipLabel>
          );
        } else if (status === "deploying") {
          badge = (
            <ToolTipLabel label="This step may take up to 30 minutes.">
              <div>
                <Badge variant="default" className="gap-1.5">
                  <Spinner className="size-3" />
                  Deploying
                </Badge>
              </div>
            </ToolTipLabel>
          );
        } else if (status === "paymentFailed") {
          badge = (
            <ToolTipLabel
              label={
                "There was an error charging your payment method. Please contact support@thirdweb.com."
              }
            >
              <div>
                <Badge variant="destructive" className="gap-1.5">
                  <CircleAlertIcon className="size-3" />
                  Payment Failed
                </Badge>
              </div>
            </ToolTipLabel>
          );
        }

        return (
          <div className="py-3">
            {badge ? (
              <div className="flex items-center gap-4 py-2">
                <p className="font-semibold text-lg"> {name} </p>
                {badge}
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                <Link
                  href={`/dashboard/engine/${id}`}
                  className="text-foreground flex text-lg font-semibold items-center before:absolute before:inset-0 before:bg-transparent"
                >
                  {name}
                </Link>
                <p className="text-muted-foreground text-sm">{url}</p>
              </div>
            )}
          </div>
        );
      },
    }),
  ];

  return (
    <>
      <TWTable
        title="engine instances"
        data={instances}
        columns={columns}
        isFetched={isFetched}
        isLoading={isLoading}
        onMenuClick={[
          {
            icon: BiPencil,
            text: "Edit",
            onClick: (instance) => {
              trackEvent({
                category: "engine",
                action: "edit",
                label: "open-modal",
              });
              setInstanceToUpdate(instance);
              setIsEditModalOpen(true);
            },
          },
          {
            icon: FiTrash,
            text: "Remove",
            onClick: (instance) => {
              trackEvent({
                category: "engine",
                action: "remove",
                label: "open-modal",
              });
              setInstanceToUpdate(instance);
              setIsRemoveModalOpen(true);
            },
            isDestructive: true,
          },
        ]}
        bodyRowClassName="hover:bg-secondary relative"
      />

      {instanceToUpdate && (
        <EditModal
          instance={instanceToUpdate}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          refetch={refetch}
        />
      )}

      {instanceToUpdate && (
        <RemoveModal
          instance={instanceToUpdate}
          onOpenChange={setIsRemoveModalOpen}
          open={isRemoveModalOpen}
          refetch={refetch}
        />
      )}
    </>
  );
};

const EditModal = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: EngineInstance;
  refetch: () => void;
}) => {
  const editInstance = useEngineEditInstance();
  const { onOpenChange, instance, open, refetch } = props;

  const form = useForm<EditEngineInstanceInput>({
    defaultValues: {
      instanceId: instance.id,
      name: instance.name,
      url: instance.url,
    },
    reValidateMode: "onChange",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[10001]" dialogOverlayClassName="z-[10000]">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Edit Engine Instance
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((data) =>
            editInstance.mutate(data, {
              onSuccess: () => {
                toast.success("Engine updated successfully");
                refetch();
                onOpenChange(false);
              },
              onError: () => {
                toast.error("Failed to update Engine");
              },
            }),
          )}
        >
          <div className="flex flex-col gap-6">
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter a descriptive label"
                autoFocus
                {...form.register("name", {
                  required: true,
                })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>URL</FormLabel>
              <Input
                type="url"
                placeholder="Enter your Engine URL"
                {...form.register("url", {
                  required: true,
                })}
              />
            </FormControl>
          </div>

          <DialogFooter className="mt-10 gap-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={!form.formState.isDirty}
            >
              {editInstance.isLoading ? (
                <Spinner className="size-4" />
              ) : (
                <SendIcon className="size-4" />
              )}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RemoveModal = (props: {
  instance: EngineInstance;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}) => {
  const { instance, open, onOpenChange, refetch } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[10001]" dialogOverlayClassName="z-[10000]">
        {instance.status === "paymentFailed" ||
        (instance.status === "active" && !instance.cloudDeployedAt) ? (
          <RemoveFromDashboardModalContent
            refetch={refetch}
            instance={instance}
            close={() => onOpenChange(false)}
          />
        ) : (
          <CancelSubscriptionModalContent
            refetch={refetch}
            instance={instance}
            close={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

function RemoveFromDashboardModalContent(props: {
  refetch: () => void;
  instance: EngineInstance;
  close: () => void;
}) {
  const { refetch, instance, close } = props;
  const removeFromDashboard = useEngineRemoveFromDashboard();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold tracking-tight mb-3">
          Remove Engine Instance
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          <span className="block mb-2">
            Are you sure you want to remove{" "}
            <em className="not-italic font-semibold">"{instance.name}"</em> from
            your dashboard?
          </span>
          <span className="block">
            This action does not modify your Engine infrastructure. You can
            re-add it at any time.
          </span>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-8 gap-1">
        <Button onClick={close} variant="outline">
          Close
        </Button>
        <Button
          onClick={() => {
            removeFromDashboard.mutate(instance.id, {
              onSuccess: () => {
                toast.success("Removed an Engine instance from your dashboard");
                refetch();
                close();
              },
              onError: () => {
                toast.error(
                  "Error removing an Engine instance from your dashboard",
                );
              },
            });
          }}
          variant="destructive"
          className="gap-2"
        >
          {removeFromDashboard.isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <Trash2Icon className="size-4" />
          )}
          Remove
        </Button>
      </DialogFooter>
    </>
  );
}

function CancelSubscriptionModalContent(props: {
  refetch: () => void;
  instance: EngineInstance;
  close: () => void;
}) {
  const { refetch, instance, close } = props;
  const removeCloudHosted = useEngineRemoveCloudHosted();

  const form = useForm<RemoveCloudHostedInput>({
    defaultValues: {
      instanceId: instance.id,
    },
    reValidateMode: "onChange",
  });

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold tracking-tight mb-1">
          Cancel Engine Subscription
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Complete this form to request to cancel your Engine subscription. This
          may take up to 2 business days.
        </DialogDescription>
      </DialogHeader>

      <div className="h-3" />

      <Alert variant="destructive">
        <TriangleAlertIcon className="size-5 !text-destructive-text" />
        <AlertTitle>This action is irreversible!</AlertTitle>
        <AlertDescription>
          You will no longer be able to access this Engine's local backend
          wallets. <strong>Any remaining mainnet funds will be lost.</strong>
        </AlertDescription>
      </Alert>

      <div className="h-5" />

      <form
        onSubmit={form.handleSubmit((data) =>
          removeCloudHosted.mutate(data, {
            onSuccess: () => {
              toast.success(
                "Submitted a request to cancel your Engine subscription. This may take up to 2 business days.",
                {
                  dismissible: true,
                  duration: 10000,
                },
              );

              refetch();
              close();
            },
            onError: () => {
              toast.error(
                "Error requesting to cancel your Engine subscription",
              );
            },
          }),
        )}
      >
        {/* Form */}
        <FormControl isRequired>
          <FormLabel className="!text-base">
            Please share any feedback to help us improve
          </FormLabel>
          <RadioGroup>
            <Stack>
              <Radio
                value="USING_SELF_HOSTED"
                {...form.register("reason", { required: true })}
              >
                <span className="text-sm"> Migrating to self-hosted </span>
              </Radio>
              <Radio
                value="TOO_EXPENSIVE"
                {...form.register("reason", { required: true })}
              >
                <span className="text-sm"> Too expensive </span>
              </Radio>
              <Radio
                value="MISSING_FEATURES"
                {...form.register("reason", { required: true })}
              >
                <span className="text-sm"> Missing features </span>
              </Radio>
              <Radio
                value="OTHER"
                {...form.register("reason", { required: true })}
              >
                <span className="text-sm"> Other </span>
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <div className="h-2" />

        <Textarea
          className="mt-3"
          placeholder="Provide additional feedback"
          {...form.register("feedback")}
        />

        <div className="h-8" />

        <DialogFooter className="gap-2">
          <Button onClick={close} variant="outline">
            Close
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={!form.formState.isValid}
            className="gap-2"
          >
            {removeCloudHosted.isLoading ? (
              <Spinner className="size-4" />
            ) : (
              <SendIcon className="size-4" />
            )}
            Request to cancel
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}
