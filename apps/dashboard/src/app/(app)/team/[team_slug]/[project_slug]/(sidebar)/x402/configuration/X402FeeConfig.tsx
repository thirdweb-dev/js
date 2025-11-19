"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Project } from "@/api/project/projects";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProjectClient } from "@/hooks/useApi";
import {
  type ApiKeyPayConfigValidationSchema,
  apiKeyPayConfigValidationSchema,
} from "@/schema/validations";

interface X402FeeConfigProps {
  project: Project;
  fees: {
    feeRecipient: string;
    feeBps: number;
  };
  projectWalletAddress?: string;
}

export const X402FeeConfig: React.FC<X402FeeConfigProps> = (props) => {
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
      // Find and update the engineCloud service
      const newServices = props.project.services.map((service) => {
        if (service.name === "engineCloud") {
          return {
            ...service,
            x402FeeBPS: values.developerFeeBPS,
            x402FeeRecipient: values.payoutAddress,
          };
        }
        return service;
      });

      // Update the project with the new services configuration
      await updateProjectClient(
        {
          projectId: props.project.id,
          teamId: props.project.teamId,
        },
        {
          services: newServices,
        },
      );
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
            toast.error("Failed to update fee configuration");
            console.error(err);
          },
          onSuccess: () => {
            toast.success("Fee configuration updated");
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
          bottomText="Fees are sent to recipient address"
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
              thirdweb collects a 0.3% service fee on x402 transactions. You may
              set your own developer fee in addition to this fee.
            </p>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="payoutAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient address</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          {...field}
                          className="sm:flex-1"
                          placeholder="0x..."
                        />
                        {props.projectWalletAddress && (
                          <Button
                            onClick={() => {
                              if (!props.projectWalletAddress) {
                                return;
                              }

                              form.setValue(
                                "payoutAddress",
                                props.projectWalletAddress,
                                {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                },
                              );
                            }}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            Use Project Wallet
                          </Button>
                        )}
                      </div>
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
