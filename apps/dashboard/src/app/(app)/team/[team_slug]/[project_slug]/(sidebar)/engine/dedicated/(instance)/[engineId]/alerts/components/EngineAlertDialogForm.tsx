"use client";

import {
  type EngineAlertRule,
  EngineNotificationChannelTypeConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const alertFormSchema = z.object({
  subscriptionRoutes: z.array(z.string()),
  type: z.enum(
    Object.keys(EngineNotificationChannelTypeConfig) as [
      keyof typeof EngineNotificationChannelTypeConfig,
    ],
  ),
  value: z.string(),
});

type EngineAlertFormValues = z.infer<typeof alertFormSchema>;

export function EngineAlertDialogForm(props: {
  alertRules: EngineAlertRule[];
  title: string;
  values: EngineAlertFormValues | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitButton: {
    isLoading: boolean;
    label: string;
    onSubmit: (value: EngineAlertFormValues) => void;
  };
}) {
  const form = useForm<z.infer<typeof alertFormSchema>>({
    defaultValues: {
      subscriptionRoutes: ["alert.*"],
      type: "slack",
    },
    resolver: zodResolver(alertFormSchema),
    values: props.values ?? undefined,
  });

  function onSubmit(values: z.infer<typeof alertFormSchema>) {
    props.submitButton.onSubmit(values);
  }

  const alertRuleOptions: EngineAlertRule[] = [
    {
      createdAt: new Date(),
      description: "Get notified of all alerts.",
      id: "_all_alerts",
      pausedAt: null,
      routingKey: "alert.*",
      title: "All alerts",
    },
    ...props.alertRules,
  ];

  const selectedAlertRule = alertRuleOptions.find(
    (alertRule) =>
      alertRule.routingKey === form.getValues("subscriptionRoutes")[0],
  );

  return (
    <Dialog onOpenChange={props.onOpenChange} open={props.open}>
      <DialogContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="font-semibold text-2xl tracking-tight">
                  {props.title}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-5">
                {/* Alert Rule */}
                <FormField
                  control={form.control}
                  name="subscriptionRoutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Rule</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange([value])}
                          value={field.value[0] ?? "alert.*"}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {alertRuleOptions.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.routingKey}
                                >
                                  {option.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />

                      {selectedAlertRule?.description && (
                        <FormDescription>
                          {selectedAlertRule.description}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                {/* Notification Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Notification Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.entries(
                                EngineNotificationChannelTypeConfig,
                              ).map(([type, config]) => (
                                <SelectItem key={type} value={type}>
                                  {config.display}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Value (webhook URL, Slack URL, email address, etc.) */}
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {EngineNotificationChannelTypeConfig[
                          form.getValues("type")
                        ].valueDisplay ?? "Value"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            form.getValues("type") === "email"
                              ? "email"
                              : "text"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-4 gap-4 border-border border-t bg-card p-6 lg:gap-2 ">
              <Button
                onClick={() => {
                  props.onOpenChange(false);
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="min-w-28 gap-2"
                disabled={props.submitButton.isLoading}
                type="submit"
              >
                {props.submitButton.isLoading && <Spinner className="size-4" />}
                {props.submitButton.label}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
