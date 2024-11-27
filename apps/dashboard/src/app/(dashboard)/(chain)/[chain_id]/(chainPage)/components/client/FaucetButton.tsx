"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  THIRDWEB_ENGINE_FAUCET_WALLET,
  TURNSTILE_SITE_KEY,
} from "@/constants/env";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Turnstile } from "@marsidev/react-turnstile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CanClaimResponseType } from "app/api/testnet-faucet/can-claim/CanClaimResponseType";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { toUnits } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { z } from "zod";
import { isOnboardingComplete } from "../../../../../../login/onboarding/isOnboardingRequired";

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
}: {
  chain: ChainMetadata;
  amount: number;
}) {
  const pathname = usePathname();
  const client = useThirdwebClient();
  const address = useActiveAccount()?.address;
  const chainId = chain.chainId;
  // do not include local overrides for chain pages
  // eslint-disable-next-line no-restricted-syntax
  const definedChain = mapV4ChainToV5Chain(chain);
  const faucetWalletBalanceQuery = useWalletBalance({
    address: THIRDWEB_ENGINE_FAUCET_WALLET,
    chain: definedChain,
    client,
  });
  const trackEvent = useTrack();

  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: async (turnstileToken: string) => {
      trackEvent({
        category: "faucet",
        action: "claim",
        label: "attempt",
        chain_id: chainId,
      });
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
      trackEvent({
        category: "faucet",
        action: "claim",
        label: "success",
        chain_id: chainId,
      });
    },
    onError: (error) => {
      trackEvent({
        category: "faucet",
        action: "claim",
        label: "error",
        chain_id: chainId,
        errorMsg: error instanceof Error ? error.message : "Unknown error",
      });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["testnet-faucet-can-claim", chainId],
      });
    },
  });

  const accountQuery = useAccount();
  const userQuery = useLoggedInUser();

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

  // Force users to log in to claim the faucet
  if (!address || !userQuery.user) {
    return (
      <CustomConnectWallet
        loginRequired={true}
        loadingButtonClassName="!w-full"
        signInLinkButtonClassName="!w-full !h-auto !rounded !bg-primary !text-primary-foreground !px-4 !py-2 !text-sm hover:!bg-primary/80"
      />
    );
  }

  if (accountQuery.isPending) {
    return (
      <Button variant="outline" className="w-full gap-2">
        Loading account <Spinner className="size-3" />
      </Button>
    );
  }

  if (!accountQuery.data) {
    return (
      <Button variant="outline" className="w-full gap-2" disabled>
        Failed to load account
      </Button>
    );
  }

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
      <Button variant="outline" disabled className="!opacity-100 w-full">
        Faucet is empty right now
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
      </Button>
    );
  }

  if (!isOnboardingComplete(accountQuery.data)) {
    return (
      <Button asChild className="w-full">
        <Link
          href={
            pathname ? `/login?next=${encodeURIComponent(pathname)}` : "/login"
          }
        >
          Verify your Email
        </Link>
      </Button>
    );
  }

  const claimFunds = (values: z.infer<typeof claimFaucetSchema>) => {
    // Instead of having a dedicated endpoint (/api/verify-token),
    // we can just attach the token in the payload and send it to the claim-faucet endpoint, to avoid a round-trip request
    const claimPromise = claimMutation.mutateAsync(values.turnstileToken);
    toast.promise(claimPromise, {
      success: `${amount} ${chain.nativeCurrency.symbol} sent successfully`,
      error: `Failed to claim ${amount} ${chain.nativeCurrency.symbol}`,
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
                    siteKey={TURNSTILE_SITE_KEY}
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
