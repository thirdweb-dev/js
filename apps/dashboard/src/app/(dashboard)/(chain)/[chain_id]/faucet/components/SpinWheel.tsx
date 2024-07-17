"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { THIRDWEB_ENGINE_FAUCET_WALLET } from "@/constants/env";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useMutation } from "@tanstack/react-query";
import type { ChainMetadataWithServices } from "app/(dashboard)/(chain)/types/chain";
import { thirdwebClient } from "lib/thirdweb-client";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { toast } from "sonner";
import { type ISpinWheelProps, SpinWheel } from "spin-wheel-game";
import { defineChain, toUnits } from "thirdweb";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";

const segments = [
  { segmentText: "Come back tomorrow", segColor: "#f771c9" }, // Mid-dark, optimized for dark mode
  { segmentText: "0.1", segColor: "#f65ac0" }, // Lightest, optimized for dark mode
  { segmentText: "Come back tomorrow", segColor: "#f542b7" }, // Slightly darker, optimized
  { segmentText: "0.01", segColor: "#f32bae" }, // Mid-light, optimized for dark mode
  { segmentText: "0.05", segColor: "#f213a5" }, // Mid, optimized for dark mode
  { segmentText: "0.01", segColor: "#da1195" }, // Mid-dark, optimized for dark mode
  { segmentText: "0.05", segColor: "#c20f84" }, // Darker, optimized for dark mode
  { segmentText: "0.01", segColor: "#a90d73" }, // Even darker, optimized
  { segmentText: "0.05", segColor: "#910b63" }, // Near darkest, optimized for dark mode
  { segmentText: "0.01", segColor: "#790a53" }, // Lightest, optimized for dark mode
  { segmentText: "0.05", segColor: "#610842" }, // Slightly darker, optimized
  { segmentText: "0.01", segColor: "#490632" }, // Mid-light, optimized for dark mode
];

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

export function TestnetSpinWheel({
  chain,
  ttlSeconds,
}: {
  chain: ChainMetadataWithServices;
  ttlSeconds: number;
}) {
  const address = useActiveAccount()?.address;
  const chainId = chain.chainId;
  const definedChain = defineChain(chainId);
  const { data: evmBalance, isLoading } = useWalletBalance({
    address: THIRDWEB_ENGINE_FAUCET_WALLET,
    chain: definedChain,
    client: thirdwebClient,
  });
  const router = useRouter();

  const claimMutation = useMutation({
    mutationFn: async (result: string) => {
      const amount = result === "Come back tomorrow" ? "0" : result;
      const requestBody = {
        chainId: chainId,
        toAddress: address,
        amount: amount,
      };

      const response = await fetch("/api/testnet-faucet/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error.error;
      }
    },
    onError: async (error: string) => {
      toast.error(error);
    },
    onSuccess: () => {
      router.refresh();
      const successMessage =
        claimMutation.variables === "Come back tomorrow"
          ? "You're not lucky today come back tomorrow"
          : `${claimMutation.variables} ${chain?.nativeCurrency?.name} sent to ${address}`;
      toast.success(successMessage);
    },
  });

  const isFaucetEmpty =
    evmBalance?.value !== undefined && evmBalance.value < toUnits("1", 17);

  const faucetMessage = isFaucetEmpty ? (
    <div>
      <p>
        There is no {chain.nativeCurrency.symbol} available. Please send funds
        to the following address:
      </p>
      <div className="h-2" />
      <CopyTextButton
        textToCopy={THIRDWEB_ENGINE_FAUCET_WALLET}
        textToShow={THIRDWEB_ENGINE_FAUCET_WALLET}
        tooltip="Copy"
        className="text-lg -translate-x-2 py-0.5"
        copyIconPosition="right"
      />
    </div>
  ) : (
    <p>You may claim {chain.nativeCurrency.symbol} once every 24 hours.</p>
  );

  const claimButtonCta =
    ttlSeconds > 0
      ? `Your next claim is available ${formatTime(ttlSeconds)}`
      : `Spin for ${chain.nativeCurrency.symbol}`;
  const closeButtonCta = ttlSeconds > 0 ? "Done" : "Close";

  const spinWheelProps: ISpinWheelProps = {
    segments,
    onFinished: claimMutation.mutateAsync,
    primaryColor: "black",
    contrastColor: "white",
    buttonText: "💜",
    isOnlyOnce: false,
    size: 290,
    // Used to randomize result.
    upDuration: Math.random() * 100 + 100,
    downDuration: 600,
    arrowLocation: "top",
    showTextOnSpin: false,
    isSpinSound: false,
  };

  if (!address) return <CustomConnectWallet />;

  return (
    <>
      {isLoading ?? <Spinner />}
      {faucetMessage}
      <Dialog>
        <DialogTrigger asChild>
          {!isFaucetEmpty && (
            <Button className="min-w-48" disabled={ttlSeconds > 0}>
              {claimButtonCta}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="w-auto h-fit max-w-none">
          {claimMutation.isSuccess && <Confetti className="w-full h-full" />}
          <DialogHeader>
            <DialogTitle>
              Spin to claim {chain.nativeCurrency.symbol} on {chain.name}
            </DialogTitle>
            <DialogDescription>
              <p className="py-2">Click the wheel to get your claim amount.</p>
              <div className="p-4">
                <SpinWheel {...spinWheelProps} />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline">
                <span className="text-muted-foreground">{closeButtonCta}</span>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
