"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon, TrashIcon } from "lucide-react";
import { type PropsWithChildren, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { randomPrivateKey } from "thirdweb/wallets";
import { z } from "zod";
import {
  createWebhook,
  deleteWebhook,
  getWebhooks,
} from "@/api/universal-bridge/developer";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
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
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredFormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenString } from "@/utils/usedapp-external";

type PayWebhooksPageProps = {
  clientId: string;
  teamId: string;
};

export function PayWebhooksPage(props: PayWebhooksPageProps) {
  const webhooksQuery = useQuery({
    queryFn: async () => {
      return await getWebhooks({
        clientId: props.clientId,
        teamId: props.teamId,
      });
    },
    queryKey: ["webhooks", props.clientId, props.teamId],
  });

  if (webhooksQuery.isPending) {
    return <GenericLoadingPage />;
  }

  if (!webhooksQuery.data?.length) {
    return (
      <div className="flex flex-col items-center gap-8 rounded-lg border border-border p-8 text-center">
        <h2 className="font-semibold text-xl">No webhooks configured yet.</h2>
        <CreateWebhookButton clientId={props.clientId} teamId={props.teamId}>
          <Button className="gap-1" variant="primary">
            <PlusIcon className="size-4" />
            <span>Create Webhook</span>
          </Button>
        </CreateWebhookButton>
      </div>
    );
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Url</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-center">Version</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooksQuery.data.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium">{webhook.label}</TableCell>
                <TableCell>{webhook.url}</TableCell>
                <TableCell>
                  {formatDistanceToNow(webhook.createdAt, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-center">
                  {webhook.version || "1"}
                </TableCell>
                <TableCell className="text-center">
                  <DeleteWebhookButton
                    clientId={props.clientId}
                    teamId={props.teamId}
                    webhookId={webhook.id}
                  >
                    <Button size="icon" variant="ghost">
                      <TrashIcon className="size-5" strokeWidth={1} />
                    </Button>
                  </DeleteWebhookButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4 flex justify-end">
        <CreateWebhookButton clientId={props.clientId} teamId={props.teamId}>
          <Button className="gap-1" size="sm" variant="default">
            <PlusIcon className="size-4" />
            <span>Create Webhook</span>
          </Button>
        </CreateWebhookButton>
      </div>
    </div>
  );
}

const formSchema = z.object({
  label: z.string().min(3, "Label must be at least 3 characters long"),
  secret: z.string().optional(),
  url: z.string().url("Please enter a valid URL."),
  version: z.string(),
});

function CreateWebhookButton(props: PropsWithChildren<PayWebhooksPageProps>) {
  const [open, setOpen] = useState(false);
  const [secretStored, setSecretStored] = useState(false);
  const secret = useMemo(() => {
    if (!open) return "";
    return randomPrivateKey();
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      label: "",
      url: "",
      version: "2",
    },
    resolver: zodResolver(formSchema),
  });
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      await createWebhook({
        clientId: props.clientId,
        label: values.label,
        secret,
        teamId: props.teamId,
        url: values.url,
        version: Number(values.version),
      });
      return null;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["webhooks", props.clientId],
      });
    },
  });
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit((values) =>
              createMutation.mutateAsync(values, {
                onError: (err) => {
                  toast.error("Failed to create webhook", {
                    description: err instanceof Error ? err.message : undefined,
                  });
                },
                onSuccess: () => {
                  setOpen(false);
                  setSecretStored(false);
                  toast.success("Webhook created successfully");
                  form.reset();
                  form.clearErrors();
                  form.setValue("url", "");
                  form.setValue("label", "");
                  form.setValue("version", "2");
                  form.setValue("secret", undefined);
                },
              }),
            )}
          >
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
              <DialogDescription>
                Receive a webhook notification when a bridge, swap or onramp
                event occurs.
              </DialogDescription>
            </DialogHeader>

            <FormField
              name="url"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>URL</RequiredFormLabel>
                  <Input {...field} placeholder="https://" />
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
                    Select the data format of the webhook payload (v2
                    recommended, v1 for legacy users).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <section>
              <FormLabel>Webhook Secret</FormLabel>

              <CopyTextButton
                className="!h-auto my-1 w-full justify-between truncate bg-card px-3 py-3 font-mono"
                copyIconPosition="right"
                textToCopy={secret}
                textToShow={shortenString(secret)}
                tooltip="Copy Webhook Secret"
              />
              <FormDescription>
                Passed as a bearer token in all webhook requests to verify the
                authenticity of the request.
              </FormDescription>
              <CheckboxWithLabel className="my-2 text-foreground">
                <Checkbox
                  checked={secretStored}
                  onCheckedChange={(v) => {
                    setSecretStored(!!v);
                  }}
                />
                I confirm that I've securely stored my webhook secret
              </CheckboxWithLabel>
            </section>

            <DialogFooter>
              <Button
                className="gap-2"
                disabled={createMutation.isPending || !secretStored}
                type="submit"
              >
                Create Webhook
                {createMutation.isPending && <Spinner className="size-4" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteWebhookButton(
  props: PropsWithChildren<PayWebhooksPageProps & { webhookId: string }>,
) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteWebhook({
        clientId: props.clientId,
        teamId: props.teamId,
        webhookId: id,
      });
      return null;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["webhooks", props.clientId],
      });
    },
  });
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
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
