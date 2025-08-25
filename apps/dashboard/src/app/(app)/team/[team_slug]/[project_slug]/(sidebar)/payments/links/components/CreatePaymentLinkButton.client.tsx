"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Bridge, toUnits } from "thirdweb";
import { checksumAddress } from "thirdweb/utils";
import z from "zod";
import { reportPaymentLinkCreated } from "@/analytics/report";
import { createPaymentLink } from "@/api/universal-bridge/developer";
import { getUniversalBridgeTokens } from "@/api/universal-bridge/tokens";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { parseErrorToMessage } from "@/utils/errorParser";
import { resolveAddressAndEns } from "@/utils/resolveAddressAndEns";

const formSchema = z.object({
  chainId: z.number(),
  tokenAddress: z.string(),
  recipient: z.string(),
  amount: z.coerce.number(),
  title: z.string(),
});

export function CreatePaymentLinkButton(
  props: PropsWithChildren<{ clientId: string; teamId: string }>,
) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="p-0 !max-w-lg">
        <CreatePaymentLinkDialogContent
          clientId={props.clientId}
          setOpen={setOpen}
          teamId={props.teamId}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreatePaymentLinkDialogContent(props: {
  clientId: string;
  teamId: string;
  setOpen: (open: boolean) => void;
}) {
  const client = getClientThirdwebClient();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      chainId: 1,
      tokenAddress: undefined,
      recipient: undefined,
      amount: undefined,
      title: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();
  const chainsQuery = useQuery({
    queryFn: async () => {
      return await Bridge.chains({ client });
    },
    queryKey: ["payments-chains"],
  });
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const tokens = await getUniversalBridgeTokens({
        chainId: values.chainId,
        address: values.tokenAddress,
      });

      const token = tokens[0];
      if (!token) {
        throw new Error("Token not found");
      }

      const addressResult = await resolveAddressAndEns(
        values.recipient,
        client,
      );

      if (!addressResult) {
        throw new Error("Invalid recipient address.");
      }

      const result = await createPaymentLink({
        clientId: props.clientId,
        teamId: props.teamId,
        intent: {
          destinationChainId: values.chainId,
          destinationTokenAddress: checksumAddress(values.tokenAddress),
          receiver: checksumAddress(addressResult.address),
          amount: toUnits(values.amount.toString(), token.decimals),
        },
        title: values.title,
      });

      return result;
    },
    onSuccess: () => {
      toast.success("Payment created successfully.");
      return queryClient.invalidateQueries({
        queryKey: ["payment-links", props.clientId, props.teamId],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(parseErrorToMessage(err), { duration: 5000 });
    },
  });

  return (
    <div>
      <DialogHeader className="p-4 lg:p-6">
        <DialogTitle>Create a Payment</DialogTitle>
        <DialogDescription>
          Get paid in any token on any chain.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            createMutation.mutateAsync(values, {
              onSuccess: (result) => {
                reportPaymentLinkCreated({
                  linkId: result.id,
                  clientId: props.clientId,
                });

                props.setOpen(false);
                form.reset();
                form.clearErrors();
              },
            }),
          )}
        >
          <div className="px-4 lg:px-6 space-y-4 pb-8">
            <FormField
              name="title"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...field}
                    placeholder="Payment for..."
                    className="bg-card"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <Input
                    className="w-full bg-card"
                    {...field}
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Address or ENS"
                    required
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="chainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chain</FormLabel>
                  <SingleNetworkSelector
                    chainIds={chainsQuery.data?.map((x) => x.chainId)}
                    chainId={field.value}
                    className="w-full bg-card"
                    disableChainId
                    client={client}
                    disableTestnets
                    onChange={(v) => {
                      field.onChange(v);
                      form.resetField("tokenAddress");
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="tokenAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <TokenSelector
                    addNativeTokenIfMissing={false}
                    chainId={form.getValues().chainId}
                    className="w-full bg-card"
                    client={client}
                    disabled={!form.getValues().chainId}
                    onChange={(token) => {
                      field.onChange(token.address);
                    }}
                    selectedToken={
                      field.value
                        ? {
                            address: field.value,
                            chainId: form.getValues().chainId,
                          }
                        : undefined
                    }
                    showCheck={false}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <Input
                    className="w-full bg-card"
                    {...field}
                    placeholder="0.0"
                    required
                    step="any"
                    type="number"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="gap-2 border-t p-4 lg:p-6 bg-card flex justify-end rounded-b-lg">
            <Button
              size="sm"
              className="gap-2 items-center"
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <PlusIcon className="size-4" />
              )}
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
