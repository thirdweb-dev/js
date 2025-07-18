"use client";

import { DollarSignIcon, ExternalLinkIcon, SplitIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  type Chain,
  type ThirdwebClient,
  type ThirdwebContract,
  toTokens,
} from "thirdweb";
import { claimReward } from "thirdweb/assets";
import { TokenIcon, TokenProvider, useSendTransaction } from "thirdweb/react";
import { DistributionBarChart } from "@/components/blocks/distribution-chart";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
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
      symbol: string;
    };
    token1: {
      address: string;
      amount: bigint;
      symbol: string;
    };
  };
  chainSlug: string;
}) {
  const sendTx = useSendTransaction();
  const router = useDashboardRouter();

  async function handleClaim() {
    const claimRewardsTx = claimReward({
      asset: props.assetContractClient.address,
      contract: props.entrypointContractClient,
    });

    const claimRewardsResult = await tryCatch(
      sendTx.mutateAsync(claimRewardsTx),
    );

    if (claimRewardsResult.error) {
      toast.error("Failed to distribute rewards", {
        description: parseError(claimRewardsResult.error),
      });
    } else {
      toast.success("Rewards distributed successfully");
      router.refresh();
    }
  }

  return (
    <ClaimRewardsPageUI
      unclaimedFees={props.unclaimedFees}
      recipient={props.reward.recipient}
      referrer={props.reward.referrer}
      handleClaim={handleClaim}
      isClaimPending={sendTx.isPending}
      client={props.assetContractClient.client}
      chain={props.assetContractClient.chain}
      chainSlug={props.chainSlug}
      referrerBps={props.reward.referrerBps}
    />
  );
}

function calculateFees(referrerBps: number) {
  // 20% of is protocol fees
  // remaining is split between referrer and recipient

  const protocolFees = 20;
  const remaining = 100 - protocolFees;

  const referrerPercentageFinal = (remaining * referrerBps) / 10000;

  return {
    protocolFees,
    referrerPercentage: referrerPercentageFinal,
    recipientPercentage: 100 - protocolFees - referrerPercentageFinal,
  };
}

export function ClaimRewardsPageUI(props: {
  unclaimedFees: {
    token0: {
      address: string;
      amount: bigint;
      symbol: string;
    };
    token1: {
      address: string;
      amount: bigint;
      symbol: string;
    };
  };
  recipient: string;
  referrer: string;
  referrerBps: number;
  handleClaim: () => void;
  isClaimPending: boolean;
  client: ThirdwebClient;
  chain: Chain;
  chainSlug: string;
}) {
  const fees = calculateFees(props.referrerBps);

  const recipientColor = `hsl(var(--chart-1))`;
  const referrerColor = `hsl(var(--chart-2))`;
  const protocolFeesColor = `hsl(var(--chart-3))`;

  const hasUnclaimedRewards =
    props.unclaimedFees.token0.amount > 0 ||
    props.unclaimedFees.token1.amount > 0;

  return (
    <div>
      <div className="bg-card rounded-lg border">
        <div className="p-4 lg:px-8 py-8 border-b border-dashed">
          <h2 className="font-semibold text-2xl tracking-tight mb-1">
            Rewards
          </h2>
          <p className="text-muted-foreground text-sm">
            Earnings received by Liquidity Providers (LPs) in exchange for
            depositing tokens into {props.unclaimedFees.token0.symbol} /{" "}
            {props.unclaimedFees.token1.symbol} Uniswap liquidity pool
          </p>
        </div>

        <div className="p-4 lg:px-8 py-8 border-b border-dashed">
          <div className="mb-3">
            <div className="flex mb-3">
              <div className="rounded-full border p-2">
                <DollarSignIcon className="size-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="font-medium text-lg">Unclaimed Rewards</h3>
            <p className="text-muted-foreground text-sm">
              The rewards that are earned but haven't been distributed yet
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row">
            <TokenReward
              token={props.unclaimedFees.token0}
              client={props.client}
              chain={props.chain}
              chainSlug={props.chainSlug}
            />
            <TokenReward
              token={props.unclaimedFees.token1}
              client={props.client}
              chain={props.chain}
              chainSlug={props.chainSlug}
            />
          </div>
        </div>

        <div className="p-4 lg:px-8 py-8">
          <div className="flex mb-3">
            <div className="rounded-full border p-2">
              <SplitIcon className="size-4 text-muted-foreground" />
            </div>
          </div>

          <h3 className="font-medium text-lg">Reward Distribution</h3>
          <p className="text-muted-foreground text-sm mb-3">
            The unclaimed rewards will be distributed as:
          </p>

          <DistributionBarChart
            segments={[
              {
                label: "Recipient",
                color: recipientColor,
                percent: fees.recipientPercentage,
                value: `${fees.recipientPercentage}%`,
              },
              {
                label: "Protocol",
                color: protocolFeesColor,
                percent: fees.protocolFees,
                value: `${fees.protocolFees}%`,
              },
              {
                label: "Referrer",
                color: referrerColor,
                percent: fees.referrerPercentage,
                value: `${fees.referrerPercentage}%`,
              },
            ]}
          />

          <div className="h-5" />

          <div className="flex gap-5">
            <div>
              <p className="font-medium text-sm">Recipient</p>
              <WalletAddress
                address={props.recipient}
                client={props.client}
                iconClassName="size-3"
                className="h-auto py-1 text-sm"
                fallbackIcon={
                  <div
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: recipientColor,
                    }}
                  />
                }
              />
            </div>

            <div className="border-l pl-5">
              <p className="font-medium text-sm">Referrer</p>
              <WalletAddress
                address={props.referrer}
                client={props.client}
                iconClassName="size-3"
                className="h-auto py-1 text-sm"
                fallbackIcon={
                  <div
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: referrerColor,
                    }}
                  />
                }
              />
            </div>
          </div>
        </div>

        <div className="p-4 py-6 lg:px-8 border-t border-dashed flex-col lg:flex-row flex lg:justify-between lg:items-center gap-4">
          {hasUnclaimedRewards && (
            <p className="text-muted-foreground text-sm">
              Click on "Distribute Rewards" to distribute unclaimed rewards
            </p>
          )}

          {!hasUnclaimedRewards && (
            <p className="text-muted-foreground text-sm">
              There are no unclaimed rewards available for distribution
            </p>
          )}
          <Button
            onClick={props.handleClaim}
            className="gap-2 rounded-lg"
            disabled={!hasUnclaimedRewards}
          >
            Distribute Rewards
            {props.isClaimPending ? (
              <Spinner className="size-4" />
            ) : (
              <SplitIcon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TokenReward(props: {
  token: {
    address: string;
    amount: bigint;
    symbol: string;
  };
  client: ThirdwebClient;
  chain: Chain;
  chainSlug: string;
}) {
  const fallbackIcon = (
    <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
      {props.token.symbol[0]}
    </div>
  );

  return (
    <div className="border p-3 rounded-lg flex items-center gap-3 min-w-[300px] bg-background relative hover:border-active-border">
      <div className="rounded-full border shrink-0">
        <TokenProvider
          address={props.token.address}
          client={props.client}
          chain={props.chain}
        >
          <TokenIcon
            className="size-10 rounded-full"
            loadingComponent={fallbackIcon}
            fallbackComponent={fallbackIcon}
          />
        </TokenProvider>
      </div>
      <div className="space-y-0.5">
        <p className="font-bold text-sm">
          {toTokens(props.token.amount, 18)} {props.token.symbol}
        </p>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`/${props.chainSlug}/${props.token.address}`}
          className="flex items-center gap-1.5 text-muted-foreground before:absolute before:inset-0"
        >
          <span className="text-xs font-mono">
            {props.token.address.slice(0, 6)}...
            {props.token.address.slice(-4)}
          </span>
          <ExternalLinkIcon className="size-3" />
        </Link>
      </div>
    </div>
  );
}
