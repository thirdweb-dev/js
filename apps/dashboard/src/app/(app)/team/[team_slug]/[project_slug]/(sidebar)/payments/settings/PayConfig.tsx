"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  type ApiKeyPayConfigValidationSchema,
  apiKeyPayConfigValidationSchema,
} from "@/schema/validations";

interface PayConfigProps {
  project: Project;
  teamId: string;
  teamSlug: string;
  fees: Fee;
}

export const PayConfig: React.FC<PayConfigProps> = (props) => {
  const form = useForm<ApiKeyPayConfigValidationSchema>({
    resolver: zodResolver(apiKeyPayConfigValidationSchema),
    values: {
      developerFeeBPS: props.fees.feeBps ? props.fees.feeBps / 100 : 0,
      payoutAddress: props.fees.feeRecipient ?? "",
    },
  });

  const updateFeeMutation = useMutation({
    mutationFn: async (values: {
      payoutAddress: string;
      developerFeeBPS: number;
    }) => {
      await updateFee({
        clientId: props.project.publishableKey,
        feeBps: values.developerFeeBPS,
        feeRecipient: values.payoutAddress,
        teamId: props.teamId,
      });
    },
  });

  const handleSubmit = form.handleSubmit(
    ({ payoutAddress, developerFeeBPS }) => {
      updateFeeMutation.mutate(
        {
          developerFeeBPS: developerFeeBPS ? developerFeeBPS * 100 : 0,
          payoutAddress,
        },
        {
          onError: (err) => {
            toast.error("Failed to update fee sharing");
            console.error(err);
          },
          onSuccess: () => {
            toast.success("Fee sharing updated");
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
      <form autoComplete="off" onSubmit={handleSubmit}>
        <SettingsCard
          bottomText="Shared Fees are sent to recipient address"
          errorText={form.getFieldState("payoutAddress").error?.message}
          noPermissionText={undefined}
          saveButton={{
            disabled: !form.formState.isDirty,
            isPending: updateFeeMutation.isPending,
            type: "submit",
          }}
        >
          <div>
            <h3 className="font-semibold text-xl tracking-tight">
              Fee Sharing
            </h3>
            <p className="mt-1.5 mb-4 text-foreground text-sm">
              thirdweb collects a 0.3% protocol fee on swap transactions. You
              may set your own developer fee in addition to this fee.{" "}
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
                        <Input {...field} placeholder="0.5" type="number" />
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
