"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { claimReward } from "thirdweb/assets";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { parseError } from "@/utils/errorParser";
import { tryCatch } from "@/utils/try-catch";
import type { getValidReward } from "../utils/rewards";
import { getUnclaimedFees } from "../utils/unclaimed-fees";

export function ClaimRewardsPage(props: {
  assetContractClient: ThirdwebContract;
  entrypointContractClient: ThirdwebContract;
  reward: NonNullable<Awaited<ReturnType<typeof getValidReward>>>;
  rewardLockerContractClient: ThirdwebContract;
  v3PositionManagerContractClient: ThirdwebContract;
}) {
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();

  async function handleClaim() {
    const claimRewardsTx = claimReward({
      asset: props.assetContractClient.address,
      contract: props.rewardLockerContractClient,
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

  const unclaimedFeesQuery = useQuery({
    queryKey: [
      "get-unclaimed-fees",
      {
        positionManager: props.v3PositionManagerContractClient.address,
        reward: {
          tokenId: props.reward.tokenId.toString(),
          recipient: props.reward.recipient,
        },
      },
    ],
    queryFn: async () =>
      getUnclaimedFees({
        positionManager: props.v3PositionManagerContractClient,
        reward: {
          tokenId: props.reward.tokenId,
          recipient: props.reward.recipient,
        },
      }),
  });

  // TODO: add proper UI

  return (
    <div>
      <h2 className="font-semibold text-2xl tracking-tight mb-3">
        Claim Rewards
      </h2>

      <div className="mb-4">
        {unclaimedFeesQuery.isPending && (
          <div className="flex items-center gap-2">
            <Spinner className="size-4" />
            Loading unclaimed fees
          </div>
        )}
        {unclaimedFeesQuery.error && (
          <div className="text-red-500">
            Failed to load unclaimed fees {parseError(unclaimedFeesQuery.error)}
          </div>
        )}

        {unclaimedFeesQuery.data && (
          <div className="flex flex-col gap-2">
            <p>
              Amount0: {unclaimedFeesQuery.data.token0.amount}{" "}
              {unclaimedFeesQuery.data.token0.address}
            </p>
            <p>
              Amount1: {unclaimedFeesQuery.data.token1.amount}{" "}
              {unclaimedFeesQuery.data.token1.address}
            </p>
          </div>
        )}

        <p>Recipient</p>
        <WalletAddress
          address={props.reward.recipient}
          client={props.assetContractClient.client}
        />
      </div>

      <Button onClick={handleClaim} className="gap-2">
        Claim Rewards
        {sendAndConfirmTransaction.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ArrowRightIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
