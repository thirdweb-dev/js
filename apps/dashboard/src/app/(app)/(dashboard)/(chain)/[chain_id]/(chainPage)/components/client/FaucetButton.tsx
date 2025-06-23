"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CanClaimResponseType } from "app/(app)/api/testnet-faucet/can-claim/CanClaimResponseType";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  prepareTransaction,
  type ThirdwebClient,
  toUnits,
  toWei,
} from "thirdweb";
import type { Chain, ChainMetadata } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSendTransaction,
  useSwitchActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";
import { z } from "zod";
import { reportFaucetUsed } from "@/analytics/report";
import { CustomConnectWallet } from "@/components/connect-wallet";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY,
} from "@/constants/public-envs";
import { parseError } from "@/utils/errorParser";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";

function formatTime(seconds: number) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return rtf.format(+hours, "hour");
  }

  if (minutes > 0) {
    return rtf.format(+minutes, "minute");
  }

  return rtf.format(+seconds, "second");
}

const claimFaucetSchema = z.object({
  turnstileToken: z.string().min(1, {
    message: "Captcha validation is required.",
  }),
});

export function FaucetButton({
  chain,
  amount,
  isLoggedIn,
  client,
}: {
  chain: ChainMetadata;
  amount: number;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const pathname = usePathname();
  const address = useActiveAccount()?.address;
  const chainId = chain.chainId;
  // do not include local overrides for chain pages
  // eslint-disable-next-line no-restricted-syntax
  const definedChain = mapV4ChainToV5Chain(chain);
  const faucetWalletBalanceQuery = useWalletBalance({
    address: NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET,
    chain: definedChain,
    client,
  });

  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: async (turnstileToken: string) => {
      const response = await fetch("/api/testnet-faucet/claim", {
        body: JSON.stringify({
          chainId: chainId,
          toAddress: address,
          turnstileToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Failed to claim funds");
      }
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["testnet-faucet-can-claim", chainId],
      });
    },
    onSuccess: () => {
      reportFaucetUsed({
        chainId,
      });
    },
  });

  const canClaimFaucetQuery = useQuery({
    queryFn: async () => {
      const response = await fetch(
        `/api/testnet-faucet/can-claim?chainId=${chainId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to get claim status");
      }
      const data = (await response.json()) as CanClaimResponseType;
      return data;
    },
    queryKey: ["testnet-faucet-can-claim", chainId],
  });

  const isFaucetEmpty =
    faucetWalletBalanceQuery.data !== undefined &&
    faucetWalletBalanceQuery.data.value < toUnits("1", 17);

  const form = useForm<z.infer<typeof claimFaucetSchema>>();

  // loading state
  if (faucetWalletBalanceQuery.isPending || canClaimFaucetQuery.isPending) {
    return (
      <Button className="w-full gap-2" variant="outline">
        Checking Faucet <Spinner className="size-3" />
      </Button>
    );
  }

  // faucet is empty
  if (isFaucetEmpty) {
    return (
      <div className="w-full">
        <div className="mb-3 text-center text-muted-foreground text-sm">
          Faucet is empty right now
        </div>
        <SendFundsToFaucetModalButton
          chain={definedChain}
          chainMeta={chain}
          client={client}
          isLoggedIn={isLoggedIn}
          onFaucetRefill={() => {
            faucetWalletBalanceQuery.refetch();
          }}
        />
      </div>
    );
  }

  // Force users to log in to claim the faucet
  if (!address || !isLoggedIn) {
    return (
      <Button asChild className="w-full" variant="primary">
        <Link
          href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
        >
          Connect Wallet
        </Link>
      </Button>
    );
  }

  // Can not claim
  if (canClaimFaucetQuery.data && canClaimFaucetQuery.data.canClaim === false) {
    return (
      <Button className="!opacity-100 w-full " disabled variant="outline">
        {canClaimFaucetQuery.data.type === "throttle" && (
          <>
            Your next claim is available{" "}
            {formatTime(canClaimFaucetQuery.data.ttlSeconds)}
          </>
        )}

        {canClaimFaucetQuery.data.type === "unsupported-chain" &&
          "Faucet is empty right now"}

        {/* TODO: add an upsell path here to subscribe to one of these plans */}
        {canClaimFaucetQuery.data.type === "paid-plan-required" &&
          "Faucet is only available on Starter, Growth, Scale and Pro plans."}
      </Button>
    );
  }

  const claimFunds = (values: z.infer<typeof claimFaucetSchema>) => {
    // Instead of having a dedicated endpoint (/api/verify-token),
    // we can just attach the token in the payload and send it to the claim-faucet endpoint, to avoid a round-trip request
    const claimPromise = claimMutation.mutateAsync(values.turnstileToken);
    toast.promise(claimPromise, {
      error: (err) => {
        return {
          description: parseError(err),
          message: `Failed to claim ${amount} ${chain.nativeCurrency.symbol}`,
        };
      },
      success: `${amount} ${chain.nativeCurrency.symbol} sent successfully`,
    });
  };

  // eligible to claim and faucet has balance
  return (
    <div className="flex w-full flex-col text-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(claimFunds)}>
          <Button className="w-full gap-2" type="submit" variant="primary">
            {claimMutation.isPending ? (
              <>
                Claiming <Spinner className="size-3" />
              </>
            ) : (
              `Get ${amount} ${chain.nativeCurrency.symbol}`
            )}
          </Button>
          <FormField
            control={form.control}
            name="turnstileToken"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Turnstile
                    className="mt-4"
                    onSuccess={(token) => field.onChange(token)}
                    siteKey={NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      {faucetWalletBalanceQuery.data && (
        <p className="mt-3 text-muted-foreground text-xs">
          {Number(faucetWalletBalanceQuery.data.displayValue).toFixed(3)}{" "}
          {faucetWalletBalanceQuery.data.symbol} left in the faucet
        </p>
      )}
    </div>
  );
}

const faucetFormSchema = z.object({
  amount: z.coerce.number().refine((value) => value > 0, {
    message: "Amount must be greater than 0",
  }),
});

function SendFundsToFaucetModalButton(props: {
  chain: Chain;
  isLoggedIn: boolean;
  client: ThirdwebClient;
  chainMeta: ChainMetadata;
  onFaucetRefill: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          Refill Faucet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Refill Faucet</DialogTitle>
          <DialogDescription>Send funds to faucet wallet</DialogDescription>
        </DialogHeader>

        <SendFundsToFaucetModalContent {...props} />
      </DialogContent>
    </Dialog>
  );
}

function SendFundsToFaucetModalContent(props: {
  chain: Chain;
  isLoggedIn: boolean;
  client: ThirdwebClient;
  chainMeta: ChainMetadata;
  onFaucetRefill: () => void;
}) {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchActiveWalletChain = useSwitchActiveWalletChain();
  const sendTxMutation = useSendTransaction({
    payModal: false,
  });
  const switchChainMutation = useMutation({
    mutationFn: async () => {
      await switchActiveWalletChain(props.chain);
    },
  });

  const form = useForm<z.infer<typeof faucetFormSchema>>({
    defaultValues: {
      amount: 0.1,
    },
    resolver: zodResolver(faucetFormSchema),
  });

  function onSubmit(values: z.infer<typeof faucetFormSchema>) {
    const sendNativeTokenTx = prepareTransaction({
      chain: props.chain,
      client: props.client,
      to: NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET,
      value: toWei(values.amount.toString()),
    });

    const promise = sendTxMutation.mutateAsync(sendNativeTokenTx);

    toast.promise(promise, {
      error: `Failed to send ${values.amount} ${props.chainMeta.nativeCurrency.symbol} to faucet`,
      success: `Sent ${values.amount} ${props.chainMeta.nativeCurrency.symbol} to faucet`,
    });

    promise.then(() => {
      props.onFaucetRefill();
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex min-w-0 flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="min-w-0">
          <p className="mb-2 text-foreground text-sm"> Faucet Wallet </p>
          <CopyTextButton
            className="w-full justify-between bg-card py-2 font-mono"
            copyIconPosition="right"
            textToCopy={NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET}
            textToShow={NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET}
            tooltip={undefined}
            variant="outline"
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    className="h-auto bg-card text-2xl md:text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                  />
                  <div className="-translate-y-1/2 absolute top-1/2 right-4 text-muted-foreground text-sm">
                    {props.chainMeta.nativeCurrency.symbol}
                  </div>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {!account && (
          <CustomConnectWallet
            chain={props.chain}
            client={props.client}
            connectButtonClassName="!w-full"
            detailsButtonClassName="!w-full"
            isLoggedIn={props.isLoggedIn}
            loginRequired={false}
          />
        )}

        {account && activeChain && (
          <div>
            {activeChain.id === props.chain.id ? (
              <Button
                className="mt-4 w-full gap-2"
                disabled={sendTxMutation.isPending}
                key="submit"
                type="submit"
              >
                {sendTxMutation.isPending && <Spinner className="size-4" />}
                Send funds to faucet
              </Button>
            ) : (
              <Button
                className="mt-4 w-full gap-2"
                disabled={switchChainMutation.isPending}
                key="switch"
                onClick={() => switchChainMutation.mutate()}
              >
                Switch to {props.chainMeta.name}{" "}
                {switchChainMutation.isPending && (
                  <Spinner className="size-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
