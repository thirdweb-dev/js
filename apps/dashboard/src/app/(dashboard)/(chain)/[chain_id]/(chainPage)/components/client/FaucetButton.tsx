"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { THIRDWEB_ENGINE_FAUCET_WALLET } from "@/constants/env";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { thirdwebClient } from "lib/thirdweb-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { defineChain, toUnits } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";

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
  const definedChain = defineChain(chainId);
  const faucetWalletBalanceQuery = useWalletBalance({
    address: THIRDWEB_ENGINE_FAUCET_WALLET,
    chain: definedChain,
    client: thirdwebClient,
  });
  // for some bizzare reason, If I use useMutation here, it's never executing the mutationFn !!!
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const router = useRouter();

  const isFaucetEmpty =
    faucetWalletBalanceQuery.data !== undefined &&
    faucetWalletBalanceQuery.data.value < toUnits("1", 17);

  if (!address) {
    return <CustomConnectWallet loginRequired={false} />;
  }

  // not eligible to claim right now
  if (ttlSeconds > 0) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Your next claim is available {formatTime(ttlSeconds)}
      </Button>
    );
  }

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

  // eligible to claim and faucet has balance
  return (
    <div className="flex flex-col w-full text-center">
      <Button
        variant="primary"
        className="w-full gap-2"
        onClick={async () => {
          setStatus("loading");
          await new Promise((resolve) => setTimeout(resolve, 2000));

          setStatus("success");
          const requestBody = {
            chainId: chainId,
            toAddress: address,
            amount,
          };

          try {
            const response = await fetch("/api/testnet-faucet/claim", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
              const data = await response.json();
              throw data.error;
            }
          } catch (e) {
            setStatus("idle");
            toast.error(
              `Failed to claim ${amount} ${chain.nativeCurrency.symbol}`,
            );
            return;
          }

          toast.success(
            `${amount} ${chain.nativeCurrency.symbol} sent successfully`,
          );
          router.refresh();
        }}
      >
        {status === "loading" ? (
          <>
            Claiming <Spinner className="size-3" />
          </>
        ) : (
          `Get ${amount} ${chain.nativeCurrency.symbol}`
        )}
      </Button>

      {faucetWalletBalanceQuery.data && (
        <p className="mt-3 text-xs">
          {Number(faucetWalletBalanceQuery.data.displayValue).toFixed(3)}{" "}
          {faucetWalletBalanceQuery.data.symbol} left in the faucet
        </p>
      )}
    </div>
  );
}
