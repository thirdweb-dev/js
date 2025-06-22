"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { ProjectResponse } from "@thirdweb-dev/service-utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { addUniversalBridgeTokenRoute } from "@/api/universal-bridge/tokens"; // Adjust the import path
import { RouteDiscoveryCard } from "@/components/blocks/RouteDiscoveryCard";
import { NetworkSelectorButton } from "@/components/misc/NetworkSelectorButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type RouteDiscoveryValidationSchema,
  routeDiscoveryValidationSchema,
} from "@/schema/validations";

export const RouteDiscovery = ({
  project,
  client,
}: {
  project: ProjectResponse;
  client: ThirdwebClient;
}) => {
  const form = useForm<RouteDiscoveryValidationSchema>({
    defaultValues: {
      chainId: 1,
      tokenAddress: undefined,
    },
    resolver: zodResolver(routeDiscoveryValidationSchema),
  });

  const submitDiscoveryMutation = useMutation({
    mutationFn: async (values: { chainId: number; tokenAddress: string }) => {
      // Call the API to add the route
      const result = await addUniversalBridgeTokenRoute({
        chainId: values.chainId,
        project,
        tokenAddress: values.tokenAddress,
      });

      return result;
    },
  });

  const handleSubmit = form.handleSubmit(
    ({ chainId, tokenAddress }) => {
      submitDiscoveryMutation.mutate(
        {
          chainId,
          tokenAddress,
        },
        {
          onError: () => {
            toast.error("Token submission failed!", {
              description:
                "Please double check the network and token address. If issues persist, please reach out to our support team.",
            });
          },
          onSuccess: () => {
            toast.success("Token submitted successfully!", {
              description:
                "Thank you for your submission. Contact support if your token doesn't appear after some time.",
            });
          },
        },
      );
    },
    () => {
      toast.error("Please fix the form errors before submitting");
    },
  );

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <RouteDiscoveryCard
          bottomText=""
          errorText={form.getFieldState("tokenAddress").error?.message}
          noPermissionText={undefined}
          saveButton={
            // Only show the submit button in the default state
            {
              disabled: !form.formState.isDirty,
              isPending: submitDiscoveryMutation.isPending,
              type: "submit",
              variant: "outline",
            }
          }
        >
          <div>
            <h3 className="font-semibold text-xl tracking-tight">
              Don't see your token listed?
            </h3>
            <p className="mt-1.5 mb-4 text-foreground text-sm">
              Select your chain and input the token address to automatically
              kick-off the token route discovery process. Please check back on
              this page within 20-40 minutes of submitting this form.
            </p>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="chainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blockchain</FormLabel>
                    <FormControl>
                      <NetworkSelectorButton
                        client={client}
                        onSwitchChain={(chain) => {
                          // Update the form field value
                          field.onChange(chain.chainId);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tokenAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Address</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input {...field} placeholder="0x..." />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </RouteDiscoveryCard>
      </form>
    </Form>
  );
};
