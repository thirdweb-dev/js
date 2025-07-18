"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { z } from "zod";
import {
  createWebhookConfig,
  type Topic,
  testDestinationUrl,
  updateWebhookConfig,
  type WebhookConfig,
} from "@/api/webhook-configs";
import { Badge } from "@/components/ui/badge";
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
  RequiredFormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
  topics: z
    .array(z.object({ id: z.string(), filters: z.unknown().nullable() }))
    .min(1, "At least one topic is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface WebhookConfigModalProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
  topics: Topic[];
  webhookConfig?: WebhookConfig; // Only required for edit mode
  client?: ThirdwebClient;
  supportedChainIds?: Array<number>;
}

export function WebhookConfigModal(props: WebhookConfigModalProps) {
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    statusCode: number;
    responseBody?: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const isEditMode = props.mode === "edit";
  const webhookConfig = props.webhookConfig;

  const form = useForm({
    defaultValues: {
      description: isEditMode ? webhookConfig?.description || "" : "",
      destinationUrl: isEditMode ? webhookConfig?.destinationUrl || "" : "",
      isPaused: isEditMode ? !!webhookConfig?.pausedAt : false,
      topics:
        isEditMode && webhookConfig?.topics
          ? webhookConfig.topics.map((t) => ({
              id: t.id,
              filters: t.filters,
            }))
          : [],
    },
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Transform topics to topicIdsWithFilters format
      const processedTopics: { id: string; filters: object | null }[] =
        values.topics.map((topic) => ({
          id: topic.id,
          filters: topic.filters || null,
        }));

      const config = {
        description: values.description,
        destinationUrl: values.destinationUrl,
        isPaused: values.isPaused,
        topicIdsWithFilters: processedTopics,
      };

      if (isEditMode && webhookConfig) {
        const result = await updateWebhookConfig({
          config,
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
          config,
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
      toast.error(
        isEditMode ? "Failed to update webhook" : "Failed to create webhook",
        {
          description: error.message,
        },
      );
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Webhook updated successfully"
          : "Webhook created successfully",
      );
      props.onSuccess();
      props.onOpenChange(false);
      if (!isEditMode) {
        form.reset();
      }
      queryClient.invalidateQueries({
        queryKey: ["webhook-configs", props.teamSlug, props.projectSlug],
      });
    },
  });

  const testMutation = useMutation({
    mutationFn: async (destinationUrl: string) => {
      const result = await testDestinationUrl({
        teamIdOrSlug: props.teamSlug,
        projectIdOrSlug: props.projectSlug,
        destinationUrl,
      });
      if (result.status === "error") {
        throw new Error(result.body);
      }
      return result.result;
    },
    onError: (error) => {
      setTestResult({
        success: false,
        statusCode: 0,
        responseBody: error.message,
      });
      toast.error("Failed to test webhook", {
        description: error.message,
      });
    },
    onSuccess: (data) => {
      const is2xx = data.httpStatusCode >= 200 && data.httpStatusCode < 300;

      setTestResult({
        success: is2xx,
        statusCode: data.httpStatusCode,
        responseBody: data.httpResponseBody,
      });

      if (is2xx) {
        toast.success(`Success! Status: ${data.httpStatusCode}`, {
          description: data.httpResponseBody,
        });
      } else {
        toast.error(`Failed! Status: ${data.httpStatusCode}`, {
          description: data.httpResponseBody,
        });
      }
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  function handleTestWebhook() {
    const destinationUrl = form.getValues("destinationUrl");

    // Validate URL
    try {
      const url = new URL(destinationUrl);
      if (!url.protocol.startsWith("https:")) {
        toast.error("URL must start with https://");
        return;
      }
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setTestResult(null);
    testMutation.mutate(destinationUrl);
  }

  function handleOpenChange(open: boolean) {
    if (!open && !mutation.isPending) {
      if (isEditMode && webhookConfig) {
        // Reset form to original values when closing edit modal
        form.reset({
          description: webhookConfig.description || "",
          destinationUrl: webhookConfig.destinationUrl || "",
          isPaused: !!webhookConfig.pausedAt,
          topics: webhookConfig.topics.map((t) => ({
            id: t.id,
            filters: t.filters,
          })),
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
                  {isEditMode ? "Edit Webhook" : "Create Webhook"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFormLabel>Description</RequiredFormLabel>
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
                      <RequiredFormLabel>Destination URL</RequiredFormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/webhook"
                          type="url"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setTestResult(null);
                            testMutation.reset();
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your webhook URL. Only https:// is supported.
                      </FormDescription>
                      <FormMessage />

                      {/* Test Webhook Button */}
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          disabled={
                            !field.value ||
                            !field.value.startsWith("https://") ||
                            testMutation.isPending
                          }
                          variant="outline"
                          onClick={handleTestWebhook}
                          type="button"
                          size="sm"
                        >
                          {testMutation.isPending && (
                            <Spinner className="size-4 mr-2" />
                          )}
                          {!testMutation.isPending &&
                            testResult &&
                            (testResult.success ? (
                              <CheckIcon className="size-4 mr-2 text-green-500" />
                            ) : (
                              <XIcon className="size-4 mr-2 text-red-500" />
                            ))}
                          Test Webhook
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topics"
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
                        Select the events to receive real-time notifications
                      </FormDescription>
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((topic) => {
                            return (
                              <Badge variant="secondary" key={topic.id}>
                                {topic.id}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-4 border-border border-t bg-card p-6 flex justify-between">
              <Button
                disabled={mutation.isPending}
                onClick={() => handleOpenChange(false)}
                variant="ghost"
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
        client={props.client}
        onOpenChange={setIsTopicSelectorOpen}
        onSelectionChange={(topics) => {
          form.setValue(
            "topics",
            topics.map((topic) => ({
              id: topic.id,
              filters: topic.filters || null,
            })) as { id: string; filters: object | null }[],
          );
        }}
        open={isTopicSelectorOpen}
        selectedTopics={form.watch("topics")}
        supportedChainIds={props.supportedChainIds}
        topics={props.topics}
      />
    </Dialog>
  );
}
