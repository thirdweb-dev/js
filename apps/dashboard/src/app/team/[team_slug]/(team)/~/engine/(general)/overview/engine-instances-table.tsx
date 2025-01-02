import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type DeleteCloudHostedInput,
  type EditEngineInstanceInput,
  type EngineInstance,
  useEngineDeleteCloudHosted,
  useEngineEditInstance,
  type useEngineInstances,
  useEngineRemoveFromDashboard,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { FormControl, Radio, RadioGroup } from "@chakra-ui/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import {
  CircleAlertIcon,
  InfoIcon,
  PencilIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { FormLabel } from "tw-components";

interface EngineInstancesTableProps {
  instances: EngineInstance[];
  isPending: boolean;
  isFetched: boolean;
  refetch: ReturnType<typeof useEngineInstances>["refetch"];
  engineLinkPrefix: string;
}

export const EngineInstancesTable: React.FC<EngineInstancesTableProps> = ({
  instances,
  isPending,
  isFetched,
  refetch,
  engineLinkPrefix,
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
            <ToolTipLabel label="There was an error charging your payment method. Please contact support@thirdweb.com.">
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
                  href={`${engineLinkPrefix}/${id}`}
                  className="flex items-center font-semibold text-foreground text-lg before:absolute before:inset-0 before:bg-transparent"
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
        title="Your Engines"
        data={instances}
        columns={columns}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
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
            icon: <Trash2Icon className="size-4" />,
            text: "Delete",
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
        bodyRowClassName="hover:bg-muted/50"
        bodyRowLinkBox
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
          <DialogTitle className="font-semibold text-2xl tracking-tight">
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
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={!form.formState.isDirty}
            >
              {editInstance.isPending && <Spinner className="size-4" />}
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
        (instance.status === "active" && !instance.deploymentId) ? (
          <RemoveFromDashboardModalContent
            refetch={refetch}
            instance={instance}
            close={() => onOpenChange(false)}
          />
        ) : (
          <DeleteSubscriptionModalContent
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
        <DialogTitle className="mb-3 font-semibold text-2xl tracking-tight">
          Remove Engine
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          <span className="mb-2 block">
            Are you sure you want to remove{" "}
            <em className="font-semibold not-italic">{instance.name}</em> from
            your dashboard?
          </span>

          <Alert variant="info">
            <InfoIcon className="size-5" />
            <AlertTitle>
              This action does not modify your Engine infrastructure.
            </AlertTitle>
            <AlertDescription>You can re-add it at any time.</AlertDescription>
          </Alert>
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
          {removeFromDashboard.isPending ? (
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

function DeleteSubscriptionModalContent(props: {
  refetch: () => void;
  instance: EngineInstance;
  close: () => void;
}) {
  const { refetch, instance, close } = props;
  invariant(
    instance.deploymentId,
    "Instance must have a deploymentId to be cancelled.",
  );

  const deleteCloudHosted = useEngineDeleteCloudHosted();
  const [ackDeletion, setAckDeletion] = useState(false);
  const form = useForm<DeleteCloudHostedInput>({
    defaultValues: {
      deploymentId: instance.deploymentId,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = (data: DeleteCloudHostedInput) => {
    deleteCloudHosted.mutate(data, {
      onSuccess: () => {
        toast.success("Deleting Engine. Please check again in a few minutes.", {
          dismissible: true,
          duration: 10000,
        });

        refetch();
        close();
      },
      onError: () => {
        toast.error(
          "Error deleting Engine. Please visit https://thirdweb.com/support.",
        );
      },
    });
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="mb-1 font-semibold text-2xl tracking-tight">
          Permanently Delete Engine
        </DialogTitle>
      </DialogHeader>

      <div className="h-4" />

      <p className="text-muted-foreground">
        This step will cancel your monthly subscription and immediately delete
        all data and infrastructure for this Engine.
      </p>

      <div className="h-4" />

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Reason */}
        <FormControl>
          <FormLabel className="!text-base">
            Please share your feedback to help us improve Engine.
          </FormLabel>
          <RadioGroup>
            <div className="flex flex-col gap-2">
              <Radio value="USING_SELF_HOSTED" {...form.register("reason")}>
                <span className="text-sm"> Migrating to self-hosted </span>
              </Radio>
              <Radio value="TOO_EXPENSIVE" {...form.register("reason")}>
                <span className="text-sm"> Too expensive </span>
              </Radio>
              <Radio value="MISSING_FEATURES" {...form.register("reason")}>
                <span className="text-sm"> Missing features </span>
              </Radio>
              <Radio value="OTHER" {...form.register("reason")}>
                <span className="text-sm"> Other </span>
              </Radio>
            </div>
          </RadioGroup>
        </FormControl>

        <div className="h-2" />

        {/* Feedback */}
        <Textarea
          className="mt-3"
          placeholder="Provide additional feedback"
          {...form.register("feedback")}
        />

        <div className="h-4" />

        <Alert variant="destructive">
          <TriangleAlertIcon className="!text-destructive-text size-4" />
          <AlertTitle>This action is irreversible!</AlertTitle>

          <AlertDescription className="!pl-0 pt-2">
            <CheckboxWithLabel>
              <Checkbox
                checked={ackDeletion}
                onCheckedChange={(checked) => setAckDeletion(!!checked)}
              />
              I understand that access to my local backend wallets and any
              remaining funds will be lost.
            </CheckboxWithLabel>
          </AlertDescription>
        </Alert>

        <div className="h-4" />

        <DialogFooter className="gap-2">
          <Button onClick={close} variant="outline">
            Close
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={
              !ackDeletion ||
              deleteCloudHosted.isPending ||
              !form.formState.isValid
            }
            className="gap-2"
          >
            {deleteCloudHosted.isPending && <Spinner className="size-4" />}
            Permanently Delete Engine
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}
