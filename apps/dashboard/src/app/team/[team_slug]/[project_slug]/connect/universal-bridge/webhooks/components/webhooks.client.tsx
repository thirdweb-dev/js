"use client";

import { payServerProxy } from "@/actions/proxies";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "app/api/lib/getAuthToken";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon, TrashIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { shortenString } from "utils/usedapp-external";
import { z } from "zod";

type Webhook = {
  url: string;
  label: string;
  active: boolean;
  createdAt: string;
  id: string;
  secret: string;
  version?: string; // TODO (UB) make this mandatory after migration
};

type PayWebhooksPageProps = {
  clientId: string;
};

const UB_BASE_URL = process.env.NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST;

export function PayWebhooksPage(props: PayWebhooksPageProps) {
  const webhooksQuery = useQuery({
    queryKey: ["webhooks", props.clientId],
    queryFn: async () => {
      const res = await payServerProxy({
        method: "GET",
        pathname: `${UB_BASE_URL}/v1/developer/webhooks`,
        headers: {
          "Content-Type": "application/json",
          "x-client-id-override": props.clientId,
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error();
      }

      const json = res.data as { result: Array<Webhook> };
      return json.result;
    },
  });

  if (webhooksQuery.isPending) {
    return <GenericLoadingPage />;
  }

  if (!webhooksQuery.data?.length) {
    return (
      <div className="flex flex-col items-center gap-8 rounded-lg border border-border p-8 text-center">
        <h2 className="font-semibold text-xl">No webhooks configured yet.</h2>
        <CreateWebhookButton clientId={props.clientId}>
          <Button variant="primary" className="gap-1">
            <PlusIcon className="size-4" />
            <span>Create Webhook</span>
          </Button>
        </CreateWebhookButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl tracking-tight">Webhooks</h2>
        <CreateWebhookButton clientId={props.clientId}>
          <Button size="sm" variant="default" className="gap-1">
            <PlusIcon className="size-4" />
            <span>Create Webhook</span>
          </Button>
        </CreateWebhookButton>
      </div>

      <div className="h-4" />

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Url</TableHead>
              <TableHead>Secret</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Webhook Version</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooksQuery.data.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium">{webhook.label}</TableCell>
                <TableCell>{webhook.url}</TableCell>
                <TableCell>
                  <CopyTextButton
                    textToShow={shortenString(webhook.secret)}
                    textToCopy={webhook.secret}
                    tooltip="Use this secret to validate the authenticity of incoming webhook requests."
                    copyIconPosition="right"
                  />
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(webhook.createdAt, { addSuffix: true })}
                </TableCell>
                <TableCell>{webhook.version || "v1"}</TableCell>
                <TableCell className="text-right">
                  <DeleteWebhookButton
                    clientId={props.clientId}
                    webhookId={webhook.id}
                  >
                    <Button variant="ghost" size="icon">
                      <TrashIcon className="size-5" strokeWidth={1} />
                    </Button>
                  </DeleteWebhookButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
  label: z.string().min(3, "Label must be at least 3 characters long"),
});

function CreateWebhookButton(props: PropsWithChildren<PayWebhooksPageProps>) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      label: "",
    },
  });
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks`, {
        method: "POST",
        body: JSON.stringify({
          ...values,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-client-id-override": props.clientId,
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create webhook");
      }

      return;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["webhooks", props.clientId],
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              createMutation.mutateAsync(values, {
                onError: (err) => {
                  toast.error("Failed to create webhook", {
                    description: err instanceof Error ? err.message : undefined,
                  });
                },
                onSuccess: () => {
                  setOpen(false);
                  toast.success("Webhook created successfully");
                  form.reset();
                  form.clearErrors();
                  form.setValue("url", "");
                  form.setValue("label", "");
                },
              }),
            )}
            className="flex flex-col gap-4"
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

            <FormItem>
              <FormLabel>Webhook Version</FormLabel>
              <Select defaultValue="v2">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="v2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v2">v2</SelectItem>
                  <SelectItem value="v1">v1</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the data format of the webhook payload (v2 recommended,
                v1 for legacy users).
              </FormDescription>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="gap-2"
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
      const res = await fetch(`${UB_BASE_URL}/v1/developer/webhooks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-client-id-override": props.clientId,
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete webhook");
      }

      return;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["webhooks", props.clientId],
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            variant="destructive"
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
            disabled={deleteMutation.isPending}
          >
            Delete Webhook
            {deleteMutation.isPending && <Spinner className="size-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
