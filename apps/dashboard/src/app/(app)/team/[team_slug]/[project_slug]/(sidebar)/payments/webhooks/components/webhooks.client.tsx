"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UnderlineLink } from "@workspace/ui/components/UnderlineLink";
import { formatDistanceToNow } from "date-fns";
import {
  DotIcon,
  InfoIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  WebhookIcon,
} from "lucide-react";
import Link from "next/link";
import { type PropsWithChildren, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { randomPrivateKey } from "thirdweb/wallets";
import { z } from "zod";
import type { Webhook } from "@/api/universal-bridge/developer";
import {
  createWebhook,
  deleteWebhook,
  getWebhooks,
  updateWebhook,
} from "@/api/universal-bridge/developer";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredFormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shortenString } from "@/utils/usedapp-external";

type PayWebhooksPageProps = {
  clientId: string;
  teamId: string;
  teamSlug: string;
  authToken: string;
  projectSlug: string;
};

export function PayWebhooksPage(props: PayWebhooksPageProps) {
  const webhooksQuery = useQuery({
    queryFn: async () => {
      const res = await getWebhooks({
        clientId: props.clientId,
        teamId: props.teamId,
        authToken: props.authToken,
      });

      return res;
    },
    queryKey: ["webhooks", props.clientId, props.teamId],
  });

  if (webhooksQuery.isPending) {
    return <GenericLoadingPage />;
  }

  if (!webhooksQuery.data?.length) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-xl">No webhooks configured</h2>
          <p className="text-sm text-muted-foreground">
            Create a webhook to receive notifications for bridge, swap or onramp
            events.
          </p>
        </div>
        <CreatePaymentWebhookButton
          clientId={props.clientId}
          teamId={props.teamId}
          authToken={props.authToken}
        >
          <Button className="gap-1.5 rounded-full">
            <PlusIcon className="size-4" />
            <span>Create Webhook</span>
          </Button>
        </CreatePaymentWebhookButton>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {webhooksQuery.data.map((webhook) => (
          <WebhookCard
            authToken={props.authToken}
            key={webhook.id}
            webhook={webhook}
            clientId={props.clientId}
            teamId={props.teamId}
            layoutPath={`/team/${props.teamSlug}/${props.projectSlug}/webhooks/payments`}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <CreatePaymentWebhookButton
          clientId={props.clientId}
          teamId={props.teamId}
          authToken={props.authToken}
        >
          <Button className="gap-1.5 rounded-full">
            <PlusIcon className="size-4" />
            <span>Create Webhook</span>
          </Button>
        </CreatePaymentWebhookButton>
      </div>
    </div>
  );
}

function WebhookCard(props: {
  webhook: Webhook;
  clientId: string;
  teamId: string;
  authToken: string;
  layoutPath: string;
}) {
  const { webhook, clientId, teamId, layoutPath } = props;
  return (
    <div
      key={webhook.id}
      className="rounded-xl border bg-card p-4 lg:p-6 relative hover:border-active-border"
    >
      <div className="flex mb-4">
        <div className="p-2 rounded-full bg-background border">
          <WebhookIcon className="size-3.5 text-muted-foreground" />
        </div>
      </div>

      <h2 className="text-base font-medium mb-2">
        <Link
          href={`${layoutPath}/${webhook.id}`}
          className="before:absolute before:inset-0"
        >
          {webhook.label || "Untitled Webhook"}
        </Link>
      </h2>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4"
          >
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <EditPaymentWebhookButton
            clientId={clientId}
            teamId={teamId}
            webhook={webhook}
            authToken={props.authToken}
          />

          <DeleteWebhookButton
            clientId={clientId}
            teamId={teamId}
            webhookId={webhook.id}
            authToken={props.authToken}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="space-y-1">
        <div className="flex items-center gap-0.5">
          <p className="text-xs text-muted-foreground">
            Created{" "}
            {formatDistanceToNow(webhook.createdAt, { addSuffix: true })}
          </p>

          {webhook.version && (
            <>
              <DotIcon className="size-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                v{webhook.version || "1"}
              </p>
            </>
          )}
        </div>

        <div className="flex max-w-[80%]">
          <CopyTextButton
            textToCopy={webhook.url}
            textToShow={webhook.url}
            tooltip="Copy URL"
            variant="ghost"
            className="text-muted-foreground text-xs -translate-x-1.5 truncate"
            copyIconPosition="right"
          />
        </div>
      </div>
    </div>
  );
}

const formSchema = z.object({
  label: z.string().min(3, "Label must be at least 3 characters long"),
  url: z.string().url("Please enter a valid URL."),
  version: z.string(),
});

function CreatePaymentWebhookButton(
  props: PropsWithChildren<{
    clientId: string;
    teamId: string;
    authToken: string;
  }>,
) {
  const [open, setOpen] = useState(false);
  const [secretStored, setSecretStored] = useState(false);
  const secret = useMemo(() => {
    if (!open) return "";
    return randomPrivateKey();
  }, [open]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await createWebhook({
      clientId: props.clientId,
      authToken: props.authToken,
      label: values.label,
      secret,
      teamId: props.teamId,
      url: values.url,
      version: Number(values.version),
    });
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Webhook</DialogTitle>
          <DialogDescription>
            Receive a webhook notification when a bridge, swap or onramp event
            occurs.
          </DialogDescription>
        </DialogHeader>

        <BridgeWebhookModalContent
          type="create"
          handleSubmit={handleSubmit}
          secret={secret}
          setOpen={setOpen}
          secretStored={secretStored}
          setSecretStored={setSecretStored}
          clientId={props.clientId}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditPaymentWebhookButton(props: {
  webhook: Webhook;
  clientId: string;
  teamId: string;
  authToken: string;
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await updateWebhook({
      clientId: props.clientId,
      webhookId: props.webhook.id,
      teamId: props.teamId,
      authToken: props.authToken,
      body: {
        label: values.label,
        url: values.url,
        version: Number(values.version),
      },
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="gap-2"
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <PencilIcon className="size-3.5" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Webhook</DialogTitle>
        </DialogHeader>

        <BridgeWebhookModalContent
          type="edit"
          handleSubmit={handleSubmit}
          setOpen={setOpen}
          clientId={props.clientId}
          webhook={props.webhook}
        />
      </DialogContent>
    </Dialog>
  );
}

function BridgeWebhookModalContent(
  props: {
    clientId: string;
    handleSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
    setOpen: (value: boolean) => void;
  } & (
    | {
        type: "create";
        secret: string;
        secretStored: boolean;
        setSecretStored: (value: boolean) => void;
      }
    | {
        type: "edit";
        webhook: Webhook;
      }
  ),
) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues:
      props.type === "create"
        ? {
            label: "",
            url: "",
            version: "2",
          }
        : {
            label: props.webhook.label,
            url: props.webhook.url,
            version: props.webhook.version?.toString() || "2",
          },
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      await props.handleSubmit(values);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["webhooks", props.clientId],
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) =>
          mutation.mutateAsync(values, {
            onError: (err) => {
              toast.error("Failed to create webhook", {
                description: err instanceof Error ? err.message : undefined,
              });
            },
            onSuccess: () => {
              props.setOpen(false);
              toast.success(
                `Webhook ${props.type === "create" ? "created" : "updated"} successfully`,
              );
            },
          }),
        )}
      >
        <FormField
          name="url"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel>URL</RequiredFormLabel>
              <Input {...field} placeholder="https://" autoComplete="off" />
              <FormDescription>
                This is the URL that will receive the webhook.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="label"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel>Label</RequiredFormLabel>
              <Input {...field} placeholder="My Webhook" />
              <FormDescription>
                A label to help you identify this webhook.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {props.type === "edit" && props.webhook.version === 1 && (
          <FormField
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="v2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">v2</SelectItem>
                    <SelectItem value="1">v1</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the data format of the webhook payload (v2 recommended,
                  v1 for legacy users).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {props.type === "create" && (
          <section>
            <FormLabel>Webhook Secret</FormLabel>

            <CopyTextButton
              className="!h-auto my-1 w-full justify-between truncate bg-card px-3 py-3 font-mono"
              copyIconPosition="right"
              textToCopy={props.secret}
              textToShow={shortenString(props.secret)}
              tooltip="Copy Webhook Secret"
            />
            <FormDescription>
              Passed as a bearer token in all webhook requests to verify the
              authenticity of the request.
            </FormDescription>

            <CheckboxWithLabel className="my-2 text-foreground">
              <Checkbox
                checked={!!props.secretStored}
                onCheckedChange={(v) => {
                  props.setSecretStored(!!v);
                }}
              />
              I confirm that I've securely stored my webhook secret
            </CheckboxWithLabel>
          </section>
        )}

        <Alert variant="warning">
          <InfoIcon className="size-4" />
          <AlertTitle> Verify payload before processing </AlertTitle>
          <AlertDescription>
            Make sure to verify receiver, destination chain, token address and
            amount to ensure that it represents the expected state of the
            transaction before processing it in your backend.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/bridge/webhooks#verify-payload"
              target="_blank"
            >
              Learn more
            </UnderlineLink>
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            className="gap-2"
            disabled={
              mutation.isPending ||
              (props.type === "create" && !props.secretStored)
            }
            type="submit"
          >
            {props.type === "create" ? "Create Webhook" : "Update Webhook"}
            {mutation.isPending && <Spinner className="size-4" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function DeleteWebhookButton(props: {
  clientId: string;
  teamId: string;
  webhookId: string;
  authToken: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteWebhook({
        clientId: props.clientId,
        teamId: props.teamId,
        webhookId: id,
        authToken: props.authToken,
      });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["webhooks", props.clientId],
      });
    },
  });
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="gap-2 text-destructive"
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <TrashIcon className="size-3.5" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            webhook.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="gap-2"
            disabled={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutateAsync(props.webhookId, {
                onError(err) {
                  toast.error("Failed to delete webhook", {
                    description: err instanceof Error ? err.message : undefined,
                  });
                },
                onSuccess: () => {
                  toast.success("Webhook deleted successfully");
                  setOpen(false);
                  return queryClient.invalidateQueries({
                    queryKey: ["webhooks", props.clientId],
                  });
                },
              });
            }}
            variant="destructive"
          >
            Delete Webhook
            {deleteMutation.isPending && <Spinner className="size-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
