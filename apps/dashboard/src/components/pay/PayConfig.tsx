import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { type ApiKey, useUpdateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ApiKeyPayConfigValidationSchema,
  apiKeyPayConfigValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spinner } from "../../@/components/ui/Spinner/Spinner";

interface PayConfigProps {
  apiKey: ApiKey;
}

const TRACKING_CATEGORY = "pay";

export const PayConfig: React.FC<PayConfigProps> = ({ apiKey }) => {
  const payService = apiKey.services?.find((service) => service.name === "pay");

  const transformedQueryData = useMemo(
    () => ({ payoutAddress: payService?.payoutAddress ?? "" }),
    [payService],
  );
  const form = useForm<ApiKeyPayConfigValidationSchema>({
    resolver: zodResolver(apiKeyPayConfigValidationSchema),
    defaultValues: transformedQueryData,
    values: transformedQueryData,
  });

  const trackEvent = useTrack();

  const mutation = useUpdateApiKey();

  return (
    <Card className="flex flex-col gap-8 py-6 px-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-lg">Fee Sharing</h2>
        <p className="text-secondary-foreground text-sm">
          thirdweb collects a 1% fee per end user transaction through{" "}
          <strong>Buy With Crypto</strong>. We share 30% of this fee with you.{" "}
          <Link
            href="https://portal.thirdweb.com/connect/pay/fee-sharing"
            target="_blank"
            className="text-link-foreground hover:text-link-foreground/80"
          >
            Learn more.
          </Link>
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ payoutAddress }) => {
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
              loading: "Saving changes...",
              success: "Changes saved",
              error: (err) => {
                return `Failed to save changes: ${err.message}`;
              },
            });
          })}
          autoComplete="off"
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="payoutAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0x..." />
                </FormControl>
                <FormDescription>
                  Shared fees will be sent to this address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full border-b" />

          <Button
            type="submit"
            variant="primary"
            disabled={!apiKey.services || mutation.isLoading}
            className="flex flex-row gap-2"
          >
            {mutation.isLoading && <Spinner className="size-4" />}
            <span>{mutation.isLoading ? "Saving ..." : "Save changes"}</span>
          </Button>
        </form>
      </Form>
    </Card>
  );
};
