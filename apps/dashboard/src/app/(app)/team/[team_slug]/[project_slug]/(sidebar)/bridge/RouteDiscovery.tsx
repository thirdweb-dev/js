"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { ProjectResponse } from "@thirdweb-dev/service-utils";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { addUniversalBridgeTokenRoute } from "@/api/universal-bridge/tokens"; // Adjust the import path
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
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

  const errorText = form.getFieldState("tokenAddress").error?.message;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="relative rounded-lg border border-border bg-card">
          <div className="relative border-dashed border-b px-4 py-6 lg:px-6">
            <h3 className="font-semibold text-xl tracking-tight mb-1">
              Add a token to Bridge
            </h3>
            <p className="mb-4 text-muted-foreground max-w-3xl text-sm text-pretty">
              Select your chain and input the token address to automatically
              kick-off the token route discovery process. <br /> This may take
              up to 20-40 minutes to complete.
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 max-w-3xl">
              <FormField
                control={form.control}
                name="chainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chain</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        className="bg-background"
                        disableChainId
                        disableDeprecated
                        client={client}
                        onChange={(chainId) => {
                          field.onChange(chainId, { shouldValidate: true });
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
          <div>
            <div className="flex items-center justify-between gap-2 px-4 py-4 lg:px-6">
              {errorText ? (
                <p className="text-destructive-text text-sm">{errorText}</p>
              ) : (
                <div />
              )}

              <Button
                className="gap-1.5 rounded-full"
                disabled={
                  !form.formState.isDirty || submitDiscoveryMutation.isPending
                }
                size="sm"
                type="submit"
                variant={"outline"}
              >
                {submitDiscoveryMutation.isPending ? (
                  <Spinner className="size-3" />
                ) : (
                  <PlusIcon className="size-4 text-muted-foreground" />
                )}
                Add Token
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
