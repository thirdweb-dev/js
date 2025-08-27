import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useEngineCreateWebhook } from "@/hooks/useEngine";
import { beautifyString } from "./webhooks-table";

const WEBHOOK_EVENT_TYPES = [
  "all_transactions",
  "sent_transaction",
  "mined_transaction",
  "errored_transaction",
  "cancelled_transaction",
  "backend_wallet_balance",
  "auth",
];

const webhookFormSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Please enter a valid URL"),
});

type WebhookFormValues = z.infer<typeof webhookFormSchema>;

export function AddWebhookButton({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) {
  const [open, setOpen] = useState(false);
  const createWebhook = useEngineCreateWebhook({
    authToken,
    instanceUrl,
  });

  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      eventType: "",
      name: "",
      url: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: WebhookFormValues) => {
    createWebhook.mutate(data, {
      onError: (error) => {
        toast.error("Failed to create webhook", {
          description: error.message,
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Webhook created successfully");
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit gap-2" onClick={() => setOpen(true)}>
          <PlusIcon className="size-4" />
          Create Webhook
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Create Webhook</DialogTitle>
          <DialogDescription>
            Create a new webhook to receive notifications for engine events.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 px-4 lg:px-6 pb-4">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WEBHOOK_EVENT_TYPES.map((eventType) => (
                          <SelectItem key={eventType} value={eventType}>
                            {beautifyString(eventType)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="My webhook"
                        {...field}
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
                        className="bg-card"
                        placeholder="https://"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 p-4 lg:p-6 bg-card border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createWebhook.isPending}
                className="gap-2"
              >
                {createWebhook.isPending && <Spinner className="size-4" />}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
