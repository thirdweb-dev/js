"use client";

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
import type { UseFormReturn } from "react-hook-form";
import type { WebhookFormValues } from "../_utils/webhook-types";

interface BasicInfoStepProps {
  form: UseFormReturn<WebhookFormValues>;
}

export default function BasicInfoStep({ form }: BasicInfoStepProps) {
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
                placeholder="Webhook name"
                value={field.value}
                onChange={field.onChange}
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
                placeholder="https://your-server.com/webhook"
                value={field.value}
                onChange={field.onChange}
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
                onValueChange={(value: string) => {
                  const typedValue = value as "event" | "transaction";
                  field.onChange(typedValue);
                  // Ensure the form state is updated immediately
                  form.setValue("filterType", typedValue, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                value={field.value || undefined}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="col-span-1">
                  <label
                    htmlFor="filter-event"
                    className={cn(
                      "flex cursor-pointer flex-col rounded-lg border-2 p-4 hover:border-primary/50",
                      field.value === "event"
                        ? "border-primary bg-primary/5"
                        : "",
                    )}
                  >
                    <RadioGroupItem
                      value="event"
                      id="filter-event"
                      className="sr-only"
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
                    htmlFor="filter-transaction"
                    className={cn(
                      "flex cursor-pointer flex-col rounded-lg border-2 p-4 hover:border-primary/50",
                      field.value === "transaction"
                        ? "border-primary bg-primary/5"
                        : "",
                    )}
                  >
                    <RadioGroupItem
                      value="transaction"
                      id="filter-transaction"
                      className="sr-only"
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
    </>
  );
}
