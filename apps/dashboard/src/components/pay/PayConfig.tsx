"use client";

import type { Project } from "@/api/projects";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProjectClient } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  type ApiKeyPayConfigValidationSchema,
  apiKeyPayConfigValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PayConfigProps {
  project: Project;
  teamId: string;
  teamSlug: string;
}

const TRACKING_CATEGORY = "pay";

export const PayConfig: React.FC<PayConfigProps> = (props) => {
  const payService = props.project.services.find(
    (service) => service.name === "pay",
  );

  const form = useForm<ApiKeyPayConfigValidationSchema>({
    resolver: zodResolver(apiKeyPayConfigValidationSchema),
    values: {
      payoutAddress: payService?.payoutAddress ?? "",
    },
  });

  const trackEvent = useTrack();

  const updateProject = useMutation({
    mutationFn: async (projectValues: Partial<Project>) => {
      await updateProjectClient(
        {
          projectId: props.project.id,
          teamId: props.teamId,
        },
        projectValues,
      );
    },
  });

  const handleSubmit = form.handleSubmit(({ payoutAddress }) => {
    const services = props.project.services;

    const newServices = services.map((service) => {
      if (service.name !== "pay") {
        return service;
      }

      return {
        ...service,
        payoutAddress,
      };
    });

    updateProject.mutate(
      {
        services: newServices,
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
  });

  if (!payService) {
    return (
      <Alert variant="warning">
        <CircleAlertIcon className="size-5" />
        <AlertTitle>Pay service is disabled</AlertTitle>
        <AlertDescription>
          Enable Pay service in{" "}
          <UnderlineLink
            href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
          >
            project settings
          </UnderlineLink>{" "}
          to configure settings
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <SettingsCard
          bottomText="Shared Fees are sent to recipient address"
          errorText={form.getFieldState("payoutAddress").error?.message}
          saveButton={{
            type: "submit",
            disabled: !form.formState.isDirty,
            isPending: updateProject.isPending,
          }}
          noPermissionText={undefined}
        >
          <div>
            <h3 className="font-semibold text-xl tracking-tight">
              Fee Sharing
            </h3>
            <p className="mt-1.5 mb-4 text-foreground text-sm">
              thirdweb collects a 0.3% protocol fee on swap transactions. You
              may set your own developer fee in addition to this fee.
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
