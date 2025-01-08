"use client";

import { SettingsCard } from "@/components/blocks/SettingsCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ApiKey, useUpdateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ApiKeyPayConfigValidationSchema,
  apiKeyPayConfigValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PayConfigProps {
  apiKey: Pick<
    ApiKey,
    | "services"
    | "id"
    | "name"
    | "domains"
    | "bundleIds"
    | "services"
    | "redirectUrls"
  >;
}

const TRACKING_CATEGORY = "pay";

export const PayConfig: React.FC<PayConfigProps> = ({ apiKey }) => {
  const payService = apiKey.services?.find((service) => service.name === "pay");

  const form = useForm<ApiKeyPayConfigValidationSchema>({
    resolver: zodResolver(apiKeyPayConfigValidationSchema),
    values: {
      payoutAddress: payService?.payoutAddress ?? "",
    },
  });

  const trackEvent = useTrack();

  const mutation = useUpdateApiKey();

  const handleSubmit = form.handleSubmit(({ payoutAddress }) => {
    const services = apiKey.services;
    if (!services) {
      throw new Error("Bad state: Missing services");
    }

    const newServices = services.map((service) => {
      if (service.name !== "pay") {
        return service;
      }

      return {
        ...service,
        payoutAddress,
      };
    });

    const formattedValues = {
      ...apiKey,
      services: newServices,
    };

    const mutationPromise = mutation.mutateAsync(formattedValues, {
      onSuccess: () => {
        trackEvent({
          category: TRACKING_CATEGORY,
          action: "configuration-update",
          label: "success",
          data: {
            payoutAddress,
          },
        });
      },
      onError: (err) => {
        trackEvent({
          category: TRACKING_CATEGORY,
          action: "configuration-update",
          label: "error",
          error: err,
        });
      },
    });

    toast.promise(mutationPromise, {
      success: "Changes saved",
      error: (err) => {
        return `Failed to save changes: ${err.message}`;
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <SettingsCard
          bottomText="Shared Fees will are sent to recipient address"
          errorText={form.getFieldState("payoutAddress").error?.message}
          saveButton={{
            type: "submit",
            disabled: !apiKey.services || !form.formState.isDirty,
            isPending: mutation.isPending,
          }}
          noPermissionText={undefined}
        >
          <div>
            <h3 className="font-semibold text-xl tracking-tight">
              Fee Sharing
            </h3>
            <p className="mt-1.5 mb-4 text-foreground text-sm">
              thirdweb collects a 1% fee per end user transaction through{" "}
              <strong>Buy With Crypto</strong>. We share 70% of this fee with
              you.{" "}
              <Link
                href="https://portal.thirdweb.com/connect/pay/fee-sharing"
                target="_blank"
                className="text-link-foreground hover:text-foreground"
              >
                Learn more.
              </Link>
            </p>

            <FormField
              control={form.control}
              name="payoutAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0x..." />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </SettingsCard>
      </form>
    </Form>
  );
};
