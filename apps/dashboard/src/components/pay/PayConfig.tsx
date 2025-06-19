"use client";

import type { Project } from "@/api/projects";
import { type Fee, updateFee } from "@/api/universal-bridge/developer";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  type ApiKeyPayConfigValidationSchema,
  apiKeyPayConfigValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PayConfigProps {
  project: Project;
  teamId: string;
  teamSlug: string;
  fees: Fee;
}

const TRACKING_CATEGORY = "pay";

export const PayConfig: React.FC<PayConfigProps> = (props) => {
  const form = useForm<ApiKeyPayConfigValidationSchema>({
    resolver: zodResolver(apiKeyPayConfigValidationSchema),
    values: {
      payoutAddress: props.fees.feeRecipient ?? "",
      developerFeeBPS: props.fees.feeBps ? props.fees.feeBps / 100 : 0,
    },
  });

  const trackEvent = useTrack();

  const updateFeeMutation = useMutation({
    mutationFn: async (values: {
      payoutAddress: string;
      developerFeeBPS: number;
    }) => {
      await updateFee({
        clientId: props.project.publishableKey,
        teamId: props.teamId,
        feeRecipient: values.payoutAddress,
        feeBps: values.developerFeeBPS,
      });
    },
  });

  const handleSubmit = form.handleSubmit(
    ({ payoutAddress, developerFeeBPS }) => {
      updateFeeMutation.mutate(
        {
          payoutAddress,
          developerFeeBPS: developerFeeBPS ? developerFeeBPS * 100 : 0,
        },
        {
          onSuccess: () => {
            toast.success("Fee sharing updated");
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
            toast.error("Failed to update fee sharing");
            console.error(err);
            trackEvent({
              category: TRACKING_CATEGORY,
              action: "configuration-update",
              label: "error",
              error: err,
            });
          },
        },
      );
    },
    (errors) => {
      console.log(errors);
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <SettingsCard
          bottomText="Shared Fees are sent to recipient address"
          errorText={form.getFieldState("payoutAddress").error?.message}
          saveButton={{
            type: "submit",
            disabled: !form.formState.isDirty,
            isPending: updateFeeMutation.isPending,
          }}
          noPermissionText={undefined}
        >
          <div>
            <h3 className="font-semibold text-xl tracking-tight">
              Fee Sharing
            </h3>
            <p className="mt-1.5 mb-4 text-foreground text-sm">
              thirdweb collects a 0.3% protocol fee on swap transactions. You
              may set your own developer fee in addition to this fee.{" "}
              <Link
                href="https://portal.thirdweb.com/connect/pay/fee-sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-foreground hover:text-foreground"
              >
                Learn more.
              </Link>
            </p>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              <FormField
                control={form.control}
                name="developerFeeBPS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee amount</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input {...field} type="number" placeholder="0.5" />
                        <span className="text-muted-foreground text-sm">%</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </SettingsCard>
      </form>
    </Form>
  );
};
