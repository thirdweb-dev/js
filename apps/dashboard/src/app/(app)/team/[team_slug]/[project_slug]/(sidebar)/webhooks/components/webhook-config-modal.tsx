"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createWebhookConfig,
  type Topic,
  updateWebhookConfig,
  type WebhookConfig,
} from "@/api/webhook-configs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Switch } from "@/components/ui/switch";
import { TopicSelectorModal } from "./topic-selector-modal";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  destinationUrl: z
    .string()
    .min(1, "Destination URL is required")
    .url("Must be a valid URL")
    .refine((url) => url.startsWith("https://"), {
      message: "URL must start with https://",
    }),
  isPaused: z.boolean().default(false),
  topicIds: z.array(z.string()).min(1, "At least one topic is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface WebhookConfigModalProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamSlug: string;
  projectSlug: string;
  topics: Topic[];
  webhookConfig?: WebhookConfig; // Only required for edit mode
}

export function WebhookConfigModal(props: WebhookConfigModalProps) {
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState(false);
  const queryClient = useQueryClient();

  const isEditMode = props.mode === "edit";
  const webhookConfig = props.webhookConfig;

  const form = useForm<FormValues>({
    defaultValues: {
      description: isEditMode ? webhookConfig?.description || "" : "",
      destinationUrl: isEditMode ? webhookConfig?.destinationUrl || "" : "",
      isPaused: isEditMode ? !!webhookConfig?.pausedAt : false,
      topicIds: isEditMode ? webhookConfig?.topics?.map((t) => t.id) || [] : [],
    },
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (isEditMode && webhookConfig) {
        const result = await updateWebhookConfig({
          config: {
            description: values.description,
            destinationUrl: values.destinationUrl,
            isPaused: values.isPaused,
            topicIds: values.topicIds,
          },
          projectIdOrSlug: props.projectSlug,
          teamIdOrSlug: props.teamSlug,
          webhookConfigId: webhookConfig.id,
        });

        if (result.status === "error") {
          throw new Error(result.body);
        }

        return result.data;
      } else {
        const result = await createWebhookConfig({
          config: values,
          projectIdOrSlug: props.projectSlug,
          teamIdOrSlug: props.teamSlug,
        });

        if (result.status === "error") {
          throw new Error(result.body);
        }

        return result.data;
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} webhook`, {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success(
        `Webhook ${isEditMode ? "updated" : "created"} successfully`,
      );
      props.onOpenChange(false);
      if (!isEditMode) {
        form.reset();
      }
      queryClient.invalidateQueries({
        queryKey: ["webhook-configs", props.teamSlug, props.projectSlug],
      });
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  function handleOpenChange(open: boolean) {
    if (!open && !mutation.isPending) {
      if (isEditMode && webhookConfig) {
        // Reset form to original values when closing edit modal
        form.reset({
          description: webhookConfig.description || "",
          destinationUrl: webhookConfig.destinationUrl || "",
          isPaused: !!webhookConfig.pausedAt,
          topicIds: webhookConfig.topics?.map((t) => t.id) || [],
        });
      } else {
        // Reset to empty values for create modal
        form.reset();
      }
    }
    props.onOpenChange(open);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={props.open}>
      <DialogContent className="overflow-hidden p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="font-semibold text-2xl tracking-tight">
                  {isEditMode ? "Edit" : "Create"} Webhook Configuration
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            isEditMode
                              ? "Enter webhook description..."
                              : "Enter a description"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/webhook"
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {isEditMode
                          ? "The URL where webhook events will be sent"
                          : "Enter your webhook URL. Only https:// is supported."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topicIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topics</FormLabel>
                      <FormControl>
                        <Button
                          className="w-full justify-start text-left font-normal"
                          onClick={() => setIsTopicSelectorOpen(true)}
                          type="button"
                          variant="outline"
                        >
                          {field.value && field.value.length > 0
                            ? `${field.value.length} topic${field.value.length !== 1 ? "s" : ""} selected`
                            : "Select topics to subscribe to"}
                        </Button>
                      </FormControl>
                      <FormDescription>
                        {isEditMode
                          ? "Select the events you want to receive notifications for"
                          : "Select the events to trigger calls to your webhook."}
                      </FormDescription>
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((topicId) => {
                            const topic = props.topics.find(
                              (t) => t.id === topicId,
                            );
                            return (
                              <div
                                className="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs"
                                key={topicId}
                              >
                                {topic?.id || topicId}
                                <button
                                  className="ml-1 text-muted-foreground hover:text-foreground"
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter(
                                        (id) => id !== topicId,
                                      ),
                                    );
                                  }}
                                  type="button"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPaused"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">
                          {isEditMode ? "Paused" : "Start Paused"}
                        </FormLabel>
                        <FormDescription className="text-xs">
                          {isEditMode
                            ? "Pause webhook notifications"
                            : "Do not send events yet. You can unpause at any time."}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-4 gap-4 border-border border-t bg-card p-6 lg:gap-2">
              <Button
                disabled={mutation.isPending}
                onClick={() => handleOpenChange(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="min-w-28 gap-2"
                disabled={mutation.isPending}
                type="submit"
              >
                {mutation.isPending && <Spinner className="size-4" />}
                {isEditMode ? "Update" : "Create"} Webhook
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <TopicSelectorModal
        onOpenChange={setIsTopicSelectorOpen}
        onSelectionChange={(topicIds) => {
          form.setValue("topicIds", topicIds);
        }}
        open={isTopicSelectorOpen}
        selectedTopicIds={form.watch("topicIds")}
        topics={props.topics}
      />
    </Dialog>
  );
}
