"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { THIRDWEB_ENGINE_FAUCET_WALLET } from "@/constants/env";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useMutation } from "@tanstack/react-query";
import { useTrack } from "hooks/analytics/useTrack";
import { thirdwebClient } from "lib/thirdweb-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toUnits } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { mapV4ChainToV5Chain } from "../../../../../../../contexts/map-chains";

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

export function FaucetButton({
  chain,
  ttlSeconds,
  amount,
}: {
  chain: ChainMetadata;
  ttlSeconds: number;
  amount: string;
}) {
  const address = useActiveAccount()?.address;
  const chainId = chain.chainId;
  // do not include local overrides for chain pages
  // eslint-disable-next-line no-restricted-syntax
  const definedChain = mapV4ChainToV5Chain(chain);
  const faucetWalletBalanceQuery = useWalletBalance({
    address: THIRDWEB_ENGINE_FAUCET_WALLET,
    chain: definedChain,
    client: thirdwebClient,
  });
  const trackEvent = useTrack();
  const claimMutation = useMutation({
    mutationFn: async () => {
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
          amount,
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
      router.refresh();
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
  });
  const router = useRouter();

  const isFaucetEmpty =
    faucetWalletBalanceQuery.data !== undefined &&
    faucetWalletBalanceQuery.data.value < toUnits("1", 17);

  // checking faucet balance
  if (faucetWalletBalanceQuery.isLoading) {
    return (
      <Button variant="secondary" className="w-full gap-2">
        Checking Faucet Balance <Spinner className="size-3" />
      </Button>
    );
  }

  // faucet is empty
  if (isFaucetEmpty) {
    return (
      <Button variant="outline" disabled className="w-full">
        Faucet is empty right now, come back later
      </Button>
    );
  }

  // not eligible to claim right now
  if (ttlSeconds > 0) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Your next claim is available {formatTime(ttlSeconds)}
      </Button>
    );
  }

  if (!address) {
    return (
      <CustomConnectWallet
        loginRequired={false}
        connectButtonClassName="!w-full !rounded !bg-primary !text-primary-foreground !px-4 !py-2 !text-sm"
      />
    );
  }

  // eligible to claim and faucet has balance
  return (
    <div className="flex flex-col w-full text-center">
      <Button
        variant="primary"
        className="w-full gap-2"
        onClick={() => {
          const claimPromise = claimMutation.mutateAsync();
          toast.promise(claimPromise, {
            success: `${amount} ${chain.nativeCurrency.symbol} sent successfully`,
            error: `Failed to claim ${amount} ${chain.nativeCurrency.symbol}`,
          });
        }}
      >
        {claimMutation.isLoading ? (
          <>
            Claiming <Spinner className="size-3" />
          </>
        ) : (
          `Get ${amount} ${chain.nativeCurrency.symbol}`
        )}
      </Button>

      {faucetWalletBalanceQuery.data && (
        <p className="mt-3 text-xs text-secondary-foreground">
          {Number(faucetWalletBalanceQuery.data.displayValue).toFixed(3)}{" "}
          {faucetWalletBalanceQuery.data.symbol} left in the faucet
        </p>
      )}
    </div>
  );
}
