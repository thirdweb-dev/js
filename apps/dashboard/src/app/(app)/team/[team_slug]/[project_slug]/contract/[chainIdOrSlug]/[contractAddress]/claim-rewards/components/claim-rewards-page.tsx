"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { readContract, type ThirdwebContract } from "thirdweb";
import { claimReward } from "thirdweb/assets";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { parseError } from "@/utils/errorParser";
import type { getValidReward } from "../utils/rewards";

const maxInt128 = 2n ** (128n - 1n) - 1n;

export function ClaimRewardsPage(props: {
  assetContractClient: ThirdwebContract;
  entrypointContractClient: ThirdwebContract;
  reward: NonNullable<Awaited<ReturnType<typeof getValidReward>>>;
  rewardLockerContractClient: ThirdwebContract;
  v3PositionManagerContractClient: ThirdwebContract;
}) {
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();

  async function handleClaim() {
    const tx = claimReward({
      asset: props.assetContractClient.address,
      contract: props.rewardLockerContractClient,
    });

    await sendAndConfirmTransaction.mutateAsync(tx);
  }

  const collectionQuery = useQuery({
    queryKey: [
      "unclaimed-fees",
      {
        ...props,
        reward: {
          ...props.reward,
          tokenId: props.reward?.tokenId.toString(),
        },
      },
    ],
    queryFn: async () => {
      const result = await readContract({
        contract: props.v3PositionManagerContractClient,
        method:
          "function collect((uint256 tokenId,address recipient,uint128 amount0Max,uint128 amount1Max)) returns (uint256,uint256)",
        params: [
          {
            tokenId: props.reward.tokenId,
            recipient: props.reward.recipient,
            amount0Max: maxInt128,
            amount1Max: maxInt128,
          },
        ],
      });

      return result;
    },
  });

  return (
    <div>
      <h2 className="font-semibold text-2xl tracking-tight mb-3">
        Claim Rewards
      </h2>

      <div className="mb-4">
        {collectionQuery.isPending && (
          <div className="flex items-center gap-2">
            <Spinner className="size-4" />
            Loading unclaimed fees
          </div>
        )}
        {collectionQuery.error && (
          <div className="text-red-500">
            Failed to load unclaimed fees {parseError(collectionQuery.error)}
          </div>
        )}

        {collectionQuery.data && (
          <div className="flex items-center gap-2">
            <p> Amount0: {collectionQuery.data[0]} </p>
            <p> Amount1: {collectionQuery.data[1]} </p>
          </div>
        )}
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
