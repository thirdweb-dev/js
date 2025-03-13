import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import {
  type DeleteCloudHostedEngineParams,
  type EditEngineInstanceParams,
  type EngineInstance,
  type RemoveEngineFromDashboardIParams,
  deleteCloudHostedEngine,
  editEngineInstance,
  removeEngineFromDashboard,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTrack } from "hooks/analytics/useTrack";
import {
  CheckIcon,
  CircleAlertIcon,
  InfoIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type DeletedCloudHostedEngine = (
  params: DeleteCloudHostedEngineParams,
) => Promise<void>;

type EditedEngineInstance = (params: EditEngineInstanceParams) => Promise<void>;

type RemovedEngineFromDashboard = (
  params: RemoveEngineFromDashboardIParams,
) => Promise<void>;

export function EngineInstancesTable(props: {
  teamIdOrSlug: string;
  instances: EngineInstance[];
  engineLinkPrefix: string;
}) {
  const router = useDashboardRouter();

  return (
    <EngineInstancesTableUI
      teamIdOrSlug={props.teamIdOrSlug}
      instances={props.instances}
      engineLinkPrefix={props.engineLinkPrefix}
      deleteCloudHostedEngine={async (params) => {
        await deleteCloudHostedEngine(params);
        router.refresh();
      }}
      editEngineInstance={async (params) => {
        await editEngineInstance(params);
        router.refresh();
      }}
      removeEngineFromDashboard={async (params) => {
        await removeEngineFromDashboard(params);
        router.refresh();
      }}
    />
  );
}

export function EngineInstancesTableUI(props: {
  teamIdOrSlug: string;
  instances: EngineInstance[];
  engineLinkPrefix: string;
  deleteCloudHostedEngine: DeletedCloudHostedEngine;
  editEngineInstance: EditedEngineInstance;
  removeEngineFromDashboard: RemovedEngineFromDashboard;
}) {
  return (
    <div className="flex grow flex-col">
      <h2 className="mb-4 font-semibold text-2xl tracking-tight">
        Engine Instances
      </h2>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Engine Instance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.instances.map((instance) => (
              <EngineInstanceRow
                key={instance.id}
                teamIdOrSlug={props.teamIdOrSlug}
                instance={instance}
                engineLinkPrefix={props.engineLinkPrefix}
                deleteCloudHostedEngine={props.deleteCloudHostedEngine}
                editEngineInstance={props.editEngineInstance}
                removeEngineFromDashboard={props.removeEngineFromDashboard}
              />
            ))}
          </TableBody>
        </Table>

        {props.instances.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">No engine instances found.</p>
          </div>
        )}
      </TableContainer>
    </div>
  );
}

function EngineInstanceRow(props: {
  teamIdOrSlug: string;
  instance: EngineInstance;
  engineLinkPrefix: string;
  deleteCloudHostedEngine: DeletedCloudHostedEngine;
  editEngineInstance: EditedEngineInstance;
  removeEngineFromDashboard: RemovedEngineFromDashboard;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const { instance, engineLinkPrefix } = props;

  return (
    <>
      <TableRow
        className={instance.status === "active" ? "hover:bg-accent/50" : ""}
        linkBox
      >
        <TableCell>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <InstanceNameLink
                instance={instance}
                engineLinkPrefix={engineLinkPrefix}
              />
              <EngineURL url={instance.url} />
            </div>
            {instance.status !== "active" && (
              <div>
                <EngineStatusBadge status={instance.status} />
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="relative z-10 w-[50px]">
          <EngineActionsDropdown
            instance={instance}
            onEdit={() => setIsEditModalOpen(true)}
            onRemove={() => setIsRemoveModalOpen(true)}
          />
        </TableCell>
      </TableRow>

      <EditModal
        teamIdOrSlug={props.teamIdOrSlug}
        instance={instance}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editEngineInstance={props.editEngineInstance}
      />

      <RemoveModal
        teamIdOrSlug={props.teamIdOrSlug}
        instance={instance}
        onOpenChange={setIsRemoveModalOpen}
        open={isRemoveModalOpen}
        deleteCloudHostedEngine={props.deleteCloudHostedEngine}
        removeEngineFromDashboard={props.removeEngineFromDashboard}
      />
    </>
  );
}

function InstanceNameLink(props: {
  instance: EngineInstance;
  engineLinkPrefix: string;
}) {
  const name = (
    <span className="font-medium text-base tracking-tight">
      {props.instance.name}
    </span>
  );
  return (
    <div className="flex flex-col gap-0.5">
      {props.instance.status === "requested" ||
      props.instance.status === "deploying" ||
      props.instance.status === "deploymentFailed" ||
      props.instance.status === "paymentFailed" ? (
        <span>{name}</span>
      ) : (
        <Link
          href={`${props.engineLinkPrefix}/${props.instance.id}`}
          className="flex items-center text-foreground before:absolute before:inset-0 before:bg-transparent"
        >
          {name}
        </Link>
      )}
    </div>
  );
}

function EngineURL(props: { url: string }) {
  const cleanedURL = props.url.endsWith("/")
    ? props.url.slice(0, -1)
    : props.url;

  return <p className="text-muted-foreground text-xs">{cleanedURL}</p>;
}

const engineStatusMeta: Record<
  EngineInstance["status"],
  {
    label: string;
    variant: BadgeProps["variant"];
    icon: React.FC<{ className?: string }>;
  }
> = {
  requested: {
    label: "Pending",
    variant: "outline",
    icon: Spinner,
  },
  deploying: {
    label: "Deploying",
    variant: "default",
    icon: Spinner,
  },
  active: {
    label: "Active",
    variant: "default",
    icon: CheckIcon,
  },
  pending: {
    label: "Pending",
    variant: "outline",
    icon: Spinner,
  },
  paymentFailed: {
    label: "Payment Failed",
    variant: "destructive",
    icon: CircleAlertIcon,
  },
  deploymentFailed: {
    label: "Deployment Failed",
    variant: "destructive",
    icon: CircleAlertIcon,
  },
};

function EngineStatusBadge(props: {
  status: EngineInstance["status"];
}) {
  const statusMeta = engineStatusMeta[props.status];
  return (
    <Badge variant={statusMeta.variant} className="gap-2 px-3 py-2">
      <statusMeta.icon className="size-3" />
      {statusMeta.label}
    </Badge>
  );
}

function EngineActionsDropdown(props: {
  instance: EngineInstance;
  onEdit: (instance: EngineInstance) => void;
  onRemove: (instance: EngineInstance) => void;
}) {
  const trackEvent = useTrack();
  const canDelete =
    props.instance.status === "paymentFailed" ||
    props.instance.status === "deploymentFailed" ||
    props.instance.status === "active" ||
    !!props.instance.deploymentId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-10 p-1">
          <MoreHorizontalIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className="gap-2"
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "edit",
              label: "open-modal",
            });
            props.onEdit(props.instance);
          }}
        >
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="gap-2 text-destructive"
          disabled={!canDelete}
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "remove",
              label: "open-modal",
            });
            props.onRemove(props.instance);
          }}
        >
          <Trash2Icon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EditModal(props: {
  open: boolean;
  teamIdOrSlug: string;
  onOpenChange: (open: boolean) => void;
  instance: EngineInstance;
  editEngineInstance: EditedEngineInstance;
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <EditModalContent
          teamIdOrSlug={props.teamIdOrSlug}
          instance={props.instance}
          editEngineInstance={props.editEngineInstance}
          closeModal={() => props.onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

const editEngineFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
});

function EditModalContent(props: {
  teamIdOrSlug: string;
  instance: EngineInstance;
  editEngineInstance: EditedEngineInstance;
  closeModal: () => void;
}) {
  const editInstance = useMutation({
    mutationFn: props.editEngineInstance,
  });
  const { instance } = props;

  const form = useForm<z.infer<typeof editEngineFormSchema>>({
    resolver: zodResolver(editEngineFormSchema),
    values: {
      name: instance.name,
      url: instance.url,
    },
    reValidateMode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          editInstance.mutate(
            {
              teamIdOrSlug: props.teamIdOrSlug,
              instanceId: props.instance.id,
              name: data.name,
              url: data.url,
            },
            {
              onSuccess: () => {
                toast.success("Engine updated successfully");
                props.closeModal();
              },
              onError: () => {
                toast.error("Failed to update Engine");
              },
            },
          ),
        )}
      >
        <div className="flex flex-col gap-4 p-6">
          <DialogHeader>
            <DialogTitle>Edit Engine Instance</DialogTitle>
          </DialogHeader>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter a descriptive label"
                    className="bg-card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="Enter your Engine URL"
                    className="bg-card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 flex justify-end gap-3 border-t bg-card p-6">
          <Button onClick={() => props.closeModal()} variant="outline">
            Close
          </Button>
          <Button
            type="submit"
            className="gap-2"
            disabled={!form.formState.isDirty}
          >
            {editInstance.isPending && <Spinner className="size-4" />}
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}

function RemoveModal(props: {
  teamIdOrSlug: string;
  instance: EngineInstance;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteCloudHostedEngine: DeletedCloudHostedEngine;
  removeEngineFromDashboard: RemovedEngineFromDashboard;
}) {
  const { instance, open, onOpenChange } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        {instance.status === "paymentFailed" ||
        instance.status === "deploymentFailed" ||
        (instance.status === "active" && !instance.deploymentId) ? (
          <RemoveEngineFromDashboardModalContent
            instance={instance}
            teamIdOrSlug={props.teamIdOrSlug}
            close={() => onOpenChange(false)}
            removeEngineFromDashboard={props.removeEngineFromDashboard}
          />
        ) : instance.deploymentId ? (
          <DeleteEngineSubscriptionModalContent
            instance={instance}
            close={() => onOpenChange(false)}
            deleteCloudHostedEngine={props.deleteCloudHostedEngine}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RemoveEngineFromDashboardModalContent(props: {
  teamIdOrSlug: string;
  instance: EngineInstance;
  close: () => void;
  removeEngineFromDashboard: RemovedEngineFromDashboard;
}) {
  const { instance, close } = props;
  const removeFromDashboard = useMutation({
    mutationFn: props.removeEngineFromDashboard,
  });

  return (
    <div>
      <div className="p-6">
        <DialogHeader>
          <DialogTitle>Remove Engine from Dashboard</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <span className="mb-2 block">
              Are you sure you want to remove{" "}
              <em className="font-semibold not-italic">{instance.name}</em> from
              your dashboard?
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="h-2" />

        <Alert variant="info">
          <InfoIcon className="size-5" />
          <AlertTitle className="text-sm">
            This action does not modify your Engine infrastructure
          </AlertTitle>
          <AlertDescription className="mt-0.5 text-sm">
            You can import engine to dashboard again later
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-end gap-3 border-t bg-card p-6">
        <Button onClick={close} variant="outline">
          Close
        </Button>
        <Button
          onClick={() => {
            removeFromDashboard.mutate(
              {
                instanceId: instance.id,
                teamIdOrSlug: props.teamIdOrSlug,
              },
              {
                onSuccess: () => {
                  toast.success(
                    "Removed an Engine instance from your dashboard",
                  );
                  close();
                },
                onError: () => {
                  toast.error(
                    "Error removing an Engine instance from your dashboard",
                  );
                },
              },
            );
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
      </div>
    </div>
  );
}

const deleteEngineReasons: Array<{
  value: DeleteCloudHostedEngineParams["reason"];
  label: string;
}> = [
  { value: "USING_SELF_HOSTED", label: "Migrating to self-hosted" },
  { value: "TOO_EXPENSIVE", label: "Too expensive" },
  { value: "MISSING_FEATURES", label: "Missing features" },
  { value: "OTHER", label: "Other" },
];

const deleteEngineFormSchema = z.object({
  reason: z.enum([
    "USING_SELF_HOSTED",
    "TOO_EXPENSIVE",
    "MISSING_FEATURES",
    "OTHER",
  ]),
  feedback: z.string(),
  confirmDeletion: z.boolean(),
});

function DeleteEngineSubscriptionModalContent(props: {
  instance: EngineInstance;
  close: () => void;
  deleteCloudHostedEngine: DeletedCloudHostedEngine;
}) {
  const { instance, close } = props;
  const deleteCloudHostedEngine = useMutation({
    mutationFn: props.deleteCloudHostedEngine,
  });

  const form = useForm<z.infer<typeof deleteEngineFormSchema>>({
    resolver: zodResolver(deleteEngineFormSchema),
    defaultValues: {
      feedback: "",
      confirmDeletion: false,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof deleteEngineFormSchema>) => {
    // unexpected state
    if (!instance.deploymentId) {
      toast.error("Can not delete this Engine instance", {
        description: "Engine instance is missing deployment id",
      });
      return;
    }

    deleteCloudHostedEngine.mutate(
      {
        deploymentId: instance.deploymentId,
        reason: data.reason,
        feedback: data.feedback,
      },
      {
        onSuccess: () => {
          toast.success(
            "Deleting Engine. Please check again in a few minutes.",
            {
              dismissible: true,
              duration: 10000,
            },
          );

          close();
        },
        onError: () => {
          toast.error(
            "Error deleting Engine. Please visit https://thirdweb.com/support.",
          );
        },
      },
    );
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-6">
            <DialogHeader className="mb-2">
              <DialogTitle>Permanently Delete Engine</DialogTitle>
            </DialogHeader>

            <p className="mb-3 text-muted-foreground text-sm">
              This step will cancel your monthly subscription and immediately
              delete all data and infrastructure for this Engine.
            </p>

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Please share your feedback to help us improve Engine.
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col gap-1"
                    >
                      {deleteEngineReasons.map((reason) => (
                        <FormItem
                          key={reason.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={reason.value} />
                          </FormControl>
                          <FormLabel className="!text-foreground font-normal text-sm">
                            {reason.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="h-4" />

            {/* Feedback */}
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="bg-card"
                      placeholder="Provide additional feedback"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="h-4" />

            <Alert variant="destructive">
              <AlertTitle>This action is irreversible!</AlertTitle>

              <AlertDescription className="!pl-0">
                <CheckboxWithLabel>
                  <Checkbox
                    checked={form.watch("confirmDeletion")}
                    onCheckedChange={(checked) =>
                      form.setValue("confirmDeletion", !!checked)
                    }
                  />
                  I understand that access to my local backend wallets and any
                  remaining funds will be lost.
                </CheckboxWithLabel>
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end gap-3 border-t bg-card p-6">
            <Button onClick={close} variant="outline">
              Close
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={
                !form.watch("confirmDeletion") ||
                deleteCloudHostedEngine.isPending
              }
              className="gap-2"
            >
              {deleteCloudHostedEngine.isPending && (
                <Spinner className="size-4" />
              )}
              Permanently Delete Engine
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
