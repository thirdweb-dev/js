"use client";

import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import { type ThirdwebClient, type ThirdwebContract, toTokens } from "thirdweb";
import { claimReward } from "thirdweb/assets";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { parseError } from "@/utils/errorParser";
import { tryCatch } from "@/utils/try-catch";
import type { getValidReward } from "../utils/rewards";

export function ClaimRewardsPage(props: {
  assetContractClient: ThirdwebContract;
  entrypointContractClient: ThirdwebContract;
  reward: NonNullable<Awaited<ReturnType<typeof getValidReward>>>;
  unclaimedFees: {
    token0: {
      address: string;
      amount: bigint;
    };
    token1: {
      address: string;
      amount: bigint;
    };
  };
}) {
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();

  async function handleClaim() {
    const claimRewardsTx = claimReward({
      asset: props.assetContractClient.address,
      contract: props.entrypointContractClient,
    });

    const claimRewardsResult = await tryCatch(
      sendAndConfirmTransaction.mutateAsync(claimRewardsTx),
    );

    if (claimRewardsResult.error) {
      toast.error("Failed to claim rewards", {
        description: parseError(claimRewardsResult.error),
      });
    } else {
      toast.success("Rewards claimed successfully");
    }
  }

  console.log({
    props,
  });

  return (
    <ClaimRewardsPageUI
      unclaimedFees={props.unclaimedFees}
      recipient={props.reward.recipient}
      referrer={props.reward.referrer}
      handleClaim={handleClaim}
      isClaimPending={sendAndConfirmTransaction.isPending}
      client={props.assetContractClient.client}
    />
  );
}

export function ClaimRewardsPageUI(props: {
  unclaimedFees: {
    token0: {
      address: string;
      amount: bigint;
    };
    token1: {
      address: string;
      amount: bigint;
    };
  };
  recipient: string;
  referrer: string;
  handleClaim: () => void;
  isClaimPending: boolean;
  client: ThirdwebClient;
}) {
  return (
    <div>
      <h2 className="font-semibold text-2xl tracking-tight mb-3">
        Claim Rewards
      </h2>

      <div className="mb-4">
        <div className="flex flex-col gap-2">
          <p>
            Amount0: {toTokens(props.unclaimedFees.token0.amount, 18)}{" "}
            {props.unclaimedFees.token0.address}
          </p>
          <p>
            Amount1: {toTokens(props.unclaimedFees.token1.amount, 18)}{" "}
            {props.unclaimedFees.token1.address}
          </p>
        </div>
        <p>Recipient</p>
        <WalletAddress address={props.recipient} client={props.client} />

        <p>Referrer</p>
        <WalletAddress address={props.referrer} client={props.client} />
      </div>

      <Button onClick={props.handleClaim} className="gap-2">
        Claim Rewards
        {props.isClaimPending ? (
          <Spinner className="size-4" />
        ) : (
          <ArrowRightIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
