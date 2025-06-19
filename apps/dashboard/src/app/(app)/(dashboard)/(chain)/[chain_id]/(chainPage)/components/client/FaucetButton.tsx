"use client";
import { reportFaucetUsed } from "@/analytics/report";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY,
} from "@/constants/public-envs";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CanClaimResponseType } from "app/(app)/api/testnet-faucet/can-claim/CanClaimResponseType";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type ThirdwebClient,
  prepareTransaction,
  toUnits,
  toWei,
} from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { Chain } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSendTransaction,
  useSwitchActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";
import { parseError } from "utils/errorParser";
import { z } from "zod";

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId: chainId,
          toAddress: address,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Failed to claim funds");
      }
    },
    onSuccess: () => {
      reportFaucetUsed({
        chainId,
      });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["testnet-faucet-can-claim", chainId],
      });
    },
  });

  const canClaimFaucetQuery = useQuery({
    queryKey: ["testnet-faucet-can-claim", chainId],
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
  });

  const isFaucetEmpty =
    faucetWalletBalanceQuery.data !== undefined &&
    faucetWalletBalanceQuery.data.value < toUnits("1", 17);

  const form = useForm<z.infer<typeof claimFaucetSchema>>();

  // loading state
  if (faucetWalletBalanceQuery.isPending || canClaimFaucetQuery.isPending) {
    return (
      <Button variant="outline" className="w-full gap-2">
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
          isLoggedIn={isLoggedIn}
          client={client}
          chainMeta={chain}
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
      <Button variant="primary" className="w-full" asChild>
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
      <Button variant="outline" className="!opacity-100 w-full " disabled>
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
      success: `${amount} ${chain.nativeCurrency.symbol} sent successfully`,
      error: (err) => {
        return {
          message: `Failed to claim ${amount} ${chain.nativeCurrency.symbol}`,
          description: parseError(err),
        };
      },
    });
  };

  // eligible to claim and faucet has balance
  return (
    <div className="flex w-full flex-col text-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(claimFunds)}>
          <Button variant="primary" className="w-full gap-2" type="submit">
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
                    siteKey={NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => field.onChange(token)}
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
        <Button variant="default" className="w-full">
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
    resolver: zodResolver(faucetFormSchema),
    defaultValues: {
      amount: 0.1,
    },
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
      success: `Sent ${values.amount} ${props.chainMeta.nativeCurrency.symbol} to faucet`,
      error: `Failed to send ${values.amount} ${props.chainMeta.nativeCurrency.symbol} to faucet`,
    });

    promise.then(() => {
      props.onFaucetRefill();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-w-0 flex-col gap-5"
      >
        <div className="min-w-0">
          <p className="mb-2 text-foreground text-sm"> Faucet Wallet </p>
          <CopyTextButton
            copyIconPosition="right"
            variant="outline"
            className="w-full justify-between bg-card py-2 font-mono"
            textToCopy={NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET}
            textToShow={NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET}
            tooltip={undefined}
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
                    type="number"
                    className="h-auto bg-card text-2xl md:text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            loginRequired={false}
            isLoggedIn={props.isLoggedIn}
            connectButtonClassName="!w-full"
            detailsButtonClassName="!w-full"
            client={props.client}
          />
        )}

        {account && activeChain && (
          <div>
            {activeChain.id === props.chain.id ? (
              <Button
                key="submit"
                type="submit"
                className="mt-4 w-full gap-2"
                disabled={sendTxMutation.isPending}
              >
                {sendTxMutation.isPending && <Spinner className="size-4" />}
                Send funds to faucet
              </Button>
            ) : (
              <Button
                key="switch"
                className="mt-4 w-full gap-2"
                disabled={switchChainMutation.isPending}
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
