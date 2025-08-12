"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { CheckoutWidget, useActiveWalletChain } from "thirdweb/react";
import { z } from "zod";
import {
  reportFundWalletFailed,
  reportFundWalletSuccessful,
} from "@/analytics/report";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Button } from "@/components/ui/button";
import { DecimalInput } from "@/components/ui/decimal-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getSDKTheme } from "@/utils/sdk-component-theme";
import { WalletAddress } from "../wallet-address";

const formSchema = z.object({
  chainId: z.number({
    required_error: "Chain is required",
  }),
  token: z.object(
    {
      chainId: z.number(),
      address: z.string(),
      symbol: z.string(),
      name: z.string(),
      decimals: z.number(),
    },
    {
      required_error: "Token is required",
    },
  ),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => {
      const num = Number(value);
      return !Number.isNaN(num) && num > 0;
    }, "Amount must be greater than 0"),
});

type FormData = z.infer<typeof formSchema>;

type FundWalletModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  recipientAddress: string;
  client: ThirdwebClient;
  defaultChainId?: number;
  checkoutWidgetTitle?: string;
};

export function FundWalletModal(props: FundWalletModalProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="p-0 gap-0 !w-full !max-w-md">
        <FundWalletModalContent
          open={props.open}
          onOpenChange={props.onOpenChange}
          title={props.title}
          description={props.description}
          recipientAddress={props.recipientAddress}
          client={props.client}
          defaultChainId={props.defaultChainId}
          checkoutWidgetTitle={props.checkoutWidgetTitle}
        />
      </DialogContent>
    </Dialog>
  );
}

function FundWalletModalContent(props: FundWalletModalProps) {
  const [step, setStep] = useState<"form" | "checkout">("form");
  const activeChain = useActiveWalletChain();
  const { theme } = useTheme();

  const form = useForm<FormData>({
    defaultValues: {
      chainId: props.defaultChainId || activeChain?.id || 1,
      token: undefined,
      amount: "0.1",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const selectedChainId = form.watch("chainId");

  return (
    <div>
      {step === "form" ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {
              setStep("checkout");
            })}
          >
            <DialogHeader className="p-4 lg:p-6">
              <DialogTitle>{props.title}</DialogTitle>
              <DialogDescription>{props.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 px-4 lg:px-6 pb-8">
              <div>
                <h3 className="text-sm font-medium"> Recipient</h3>
                <WalletAddress
                  address={props.recipientAddress}
                  client={props.client}
                  className="py-1 h-auto"
                  iconClassName="size-4"
                />
              </div>

              <FormField
                control={form.control}
                name="chainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chain</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        className="bg-card"
                        chainId={field.value}
                        onChange={(token) => {
                          field.onChange(token);
                          form.resetField("token", {
                            defaultValue: undefined,
                          });
                        }}
                        client={props.client}
                        placeholder="Select a chain"
                        disableDeprecated
                        disableTestnets
                        disableChainId
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="token"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <FormControl>
                        <TokenSelector
                          className="bg-card"
                          disableAddress
                          selectedToken={
                            field.value
                              ? {
                                  chainId: field.value.chainId,
                                  address: field.value.address,
                                }
                              : undefined
                          }
                          onChange={field.onChange}
                          chainId={selectedChainId}
                          client={props.client}
                          placeholder="Select a token"
                          enabled={!!selectedChainId}
                          addNativeTokenIfMissing={true}
                          showCheck={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DecimalInput
                          className="bg-card !text-xl h-auto font-semibold"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0.1"
                        />
                        {form.watch("token") && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            {form.watch("token").symbol}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 p-4 lg:p-6 bg-card border-t rounded-b-lg">
              <Button
                variant="outline"
                onClick={() => props.onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                Next
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div>
          <DialogHeader className="sr-only">
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>

          <div>
            <CheckoutWidget
              client={props.client}
              // eslint-disable-next-line no-restricted-syntax
              chain={defineChain(form.getValues("chainId"))}
              tokenAddress={form.getValues("token").address as `0x${string}`}
              amount={form.getValues("amount")}
              seller={props.recipientAddress as `0x${string}`}
              showThirdwebBranding={false}
              className="!w-full !max-w-full !min-w-0 !rounded-b-none !border-none"
              theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
              name={props.checkoutWidgetTitle}
              onSuccess={() => {
                reportFundWalletSuccessful();
              }}
              onError={(error) => {
                reportFundWalletFailed({
                  errorMessage: error.message,
                });
              }}
            />
          </div>

          <div className="flex justify-end gap-3 p-4 lg:p-6 bg-card border-t rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => setStep("form")}
              className="gap-2"
            >
              <ArrowLeftIcon className="size-4 text-muted-foreground" />
              Back
            </Button>

            <Button
              className="gap-2"
              variant="outline"
              onClick={() => props.onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
