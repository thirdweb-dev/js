"use client";

import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { WebhookFormValues } from "./utils/webhookTypes";

interface BasicInfoStepProps {
  form: UseFormReturn<WebhookFormValues>;
  goToNextStep: () => void;
  isLoading: boolean;
}

export default function BasicInfoStep({
  form,
  goToNextStep,
  isLoading,
}: BasicInfoStepProps) {
  const filterEventId = useId();
  const filterTransactionId = useId();
  return (
    <>
      <div className="mb-4">
        <h2 className="font-medium text-lg">Step 1: Basic Information</h2>
        <p className="text-muted-foreground text-sm">
          Provide webhook details and select filter type
        </p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                onChange={field.onChange}
                placeholder="Webhook name"
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="webhookUrl"
        render={({ field }) => (
          <FormItem className="mt-4 flex flex-col">
            <FormLabel>
              Webhook URL <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                onChange={field.onChange}
                placeholder="https://your-server.com/webhook"
                type="url"
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="filterType"
        render={({ field }) => (
          <FormItem className="mt-6 flex flex-col">
            <FormLabel>
              Filter Type <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                onValueChange={(value: string) => {
                  if (value !== "event" && value !== "transaction") {
                    return;
                  }
                  field.onChange(value);
                  // Ensure the form state is updated immediately
                  form.setValue("filterType", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                value={field.value || undefined}
              >
                <div className="col-span-1">
                  <label
                    className={cn(
                      "flex cursor-pointer flex-col rounded-lg border-2 p-4 hover:border-primary/50",
                      field.value === "event"
                        ? "border-primary bg-primary/5"
                        : "",
                    )}
                    htmlFor={filterEventId}
                  >
                    <RadioGroupItem
                      className="sr-only"
                      id={filterEventId}
                      value="event"
                    />
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-base">Event</span>
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          field.value === "event"
                            ? "border-primary"
                            : "border-muted-foreground",
                        )}
                      >
                        {field.value === "event" && (
                          <div className="h-3 w-3 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      Listen for contract events like token transfers or state
                      changes
                    </span>
                  </label>
                </div>

                <div className="col-span-1">
                  <label
                    className={cn(
                      "flex cursor-pointer flex-col rounded-lg border-2 p-4 hover:border-primary/50",
                      field.value === "transaction"
                        ? "border-primary bg-primary/5"
                        : "",
                    )}
                    htmlFor={filterTransactionId}
                  >
                    <RadioGroupItem
                      className="sr-only"
                      id={filterTransactionId}
                      value="transaction"
                    />
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-base">Transaction</span>
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          field.value === "transaction"
                            ? "border-primary"
                            : "border-muted-foreground",
                        )}
                      >
                        {field.value === "transaction" && (
                          <div className="h-3 w-3 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      Listen for blockchain transactions with specific
                      parameters
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-6 flex justify-end">
        <Button disabled={isLoading} onClick={goToNextStep} type="button">
          Next
        </Button>
      </div>
    </>
  );
}
