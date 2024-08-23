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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
};

export type WebhooksPageProps = {
  apiKey: ApiKey;
};

export function WebhooksPage(props: WebhooksPageProps) {
  const webhooksQuery = useQuery({
    queryKey: ["webhooks", props.apiKey.key],
    queryFn: async () => {
      const res = await fetch(
        `/api/server-proxy/pay/webhooks/get-all?clientId=${props.apiKey.key}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const json = await res.json();
      return json.result as Array<Webhook>;
    },
  });

  if (webhooksQuery.isLoading) {
    return <Spinner className="size-8 mx-auto" />;
  }

  if (!webhooksQuery.data?.length) {
    return (
      <div className="border border-border rounded-lg p-8 text-center flex flex-col items-center gap-8">
        <h2 className="text-xl font-semibold">No webhooks configured yet.</h2>
        <CreateWebhookButton apiKey={props.apiKey}>
          <Button variant="primary" className="gap-1">
            <PlusIcon className="size-4" />
            <span>Create Webhook</span>
          </Button>
        </CreateWebhookButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Url</TableHead>
            <TableHead>Secret</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">
              <CreateWebhookButton apiKey={props.apiKey}>
                <Button size="sm" variant="primary" className="gap-1">
                  <PlusIcon className="size-4" />
                  <span>Create New Webhook</span>
                </Button>
              </CreateWebhookButton>
            </TableHead>
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
                  tooltip={
                    "Use this secret to validate the authenticity of incoming webhook requests."
                  }
                  copyIconPosition={"right"}
                />
              </TableCell>
              <TableCell>
                {formatDistanceToNow(webhook.createdAt, { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <DeleteWebhookButton
                  apiKey={props.apiKey}
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
    </div>
  );
}

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
  label: z.string().min(1, "Please enter a label."),
});

function CreateWebhookButton(props: PropsWithChildren<WebhooksPageProps>) {
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
      const res = await fetch("/api/server-proxy/pay/webhooks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, clientId: props.apiKey.key }),
      });
      const json = await res.json();
      return json.result as string;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries(["webhooks", props.apiKey.key]);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              toast.promise(
                createMutation.mutateAsync(values, {
                  onError: (err) =>
                    toast.error("Failed to create webhook", {
                      description: (err as Error).message,
                    }),
                  onSuccess: () => {
                    setOpen(false);
                    form.reset();
                    form.clearErrors();
                    form.setValue("url", "");
                    form.setValue("label", "");
                  },
                }),
                {
                  loading: "Creating webhook...",
                  success: "Webhook created",
                  error: "Failed to create webhook",
                },
              ),
            )}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
              <DialogDescription>
                Receive a webhook notification when a pay event occurs.
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

            {/* Note: this is a "fake" form field since there is nothing to select yet */}
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select disabled defaultValue="purchase_complete">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Purchase Complete" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase_complete">
                    Purchase Complete
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Which event should trigger this webhook?
              </FormDescription>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button type="submit" disabled={createMutation.isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteWebhookButton(
  props: PropsWithChildren<WebhooksPageProps & { webhookId: string }>,
) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/server-proxy/pay/webhooks/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, clientId: props.apiKey.key }),
      });
      const json = await res.json();
      return json.result as string;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries(["webhooks", props.apiKey.key]);
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
            variant="destructive"
            onClick={() => {
              toast.promise(
                deleteMutation.mutateAsync(props.webhookId, {
                  onSuccess: () => {
                    setOpen(false);
                  },
                }),
                {
                  loading: "Deleting webhook...",
                  success: "Webhook deleted",
                  error: "Failed to delete webhook",
                },
              );
            }}
            disabled={deleteMutation.isLoading}
          >
            Yes, Delete Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
