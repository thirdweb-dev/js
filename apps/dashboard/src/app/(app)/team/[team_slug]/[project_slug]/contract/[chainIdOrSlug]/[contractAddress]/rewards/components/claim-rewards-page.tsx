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
import { TokenIcon, TokenProvider } from "thirdweb/react";
import { claimRewards } from "thirdweb/tokens";
import { DistributionBarChart } from "@/components/blocks/distribution-chart";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { TransactionButton } from "@/components/tx-button";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
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
      decimals: number;
    };
    token1: {
      address: string;
      amount: bigint;
      symbol: string;
      decimals: number;
    };
  };
  chainSlug: string;
}) {
  const sendAndConfirmTx = useSendAndConfirmTx();
  const router = useDashboardRouter();

  async function handleClaim() {
    const claimRewardsTx = claimRewards({
      asset: props.assetContractClient.address,
      contract: props.entrypointContractClient,
    });

    const claimRewardsResult = await tryCatch(
      sendAndConfirmTx.mutateAsync(claimRewardsTx),
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
      developer={props.reward.developer}
      handleClaim={handleClaim}
      isClaimPending={sendAndConfirmTx.isPending}
      client={props.assetContractClient.client}
      chain={props.assetContractClient.chain}
      chainSlug={props.chainSlug}
      developerBps={props.reward.developerBps}
    />
  );
}

function calculateFees(developerBps: number) {
  // 20% of is protocol fees
  // remaining is split between developer and recipient

  const protocolFees = 20;
  const remaining = 100 - protocolFees;

  const developerPercentageFinal = (remaining * developerBps) / 10000;

  return {
    protocolFees,
    developerPercentage: developerPercentageFinal,
    recipientPercentage: 100 - protocolFees - developerPercentageFinal,
  };
}

export function ClaimRewardsPageUI(props: {
  unclaimedFees: {
    token0: {
      address: string;
      amount: bigint;
      symbol: string;
      decimals: number;
    };
    token1: {
      address: string;
      amount: bigint;
      symbol: string;
      decimals: number;
    };
  };
  recipient: string;
  developer: string;
  developerBps: number;
  handleClaim: () => void;
  isClaimPending: boolean;
  client: ThirdwebClient;
  chain: Chain;
  chainSlug: string;
}) {
  const fees = calculateFees(props.developerBps);

  const recipientColor = `hsl(var(--chart-1))`;
  const developerColor = `hsl(var(--chart-2))`;
  const protocolFeesColor = `hsl(var(--chart-3))`;

  const hasUnclaimedRewards =
    props.unclaimedFees.token0.amount > 0 ||
    props.unclaimedFees.token1.amount > 0;

  return (
    <div>
      <div className="bg-card rounded-lg border">
        <div className="p-4 lg:p-6 border-b border-dashed">
          <div className="flex mb-3">
            <div className="rounded-full border bg-background p-2">
              <DollarSignIcon className="size-5 text-muted-foreground" />
            </div>
          </div>

          <h2 className="font-semibold text-2xl tracking-tight mb-0.5">
            Rewards
          </h2>
          <p className="text-muted-foreground text-sm">
            Earnings received by Liquidity Providers (LPs) in exchange for
            depositing tokens into {props.unclaimedFees.token0.symbol} /{" "}
            {props.unclaimedFees.token1.symbol} Uniswap liquidity pool
          </p>
        </div>

        <div className="p-4 lg:px-6 py-8 border-b border-dashed">
          <div className="mb-4">
            <h3 className="font-medium text-base mb-1">Unclaimed Rewards</h3>
            <p className="text-muted-foreground text-sm">
              The rewards that are earned but haven't been distributed yet
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
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

        <div className="p-4 lg:px-6 py-8">
          <h3 className="font-medium text-base mb-1">Reward Distribution</h3>
          <p className="text-muted-foreground text-sm mb-4">
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
                label: "Developer",
                color: developerColor,
                percent: fees.developerPercentage,
                value: `${fees.developerPercentage}%`,
              },
            ]}
          />

          <div className="h-6" />

          <div className="flex gap-5">
            <div>
              <p className="font-medium text-sm">Recipient</p>
              <WalletAddress
                address={props.recipient}
                client={props.client}
                iconClassName="size-3"
                className="h-auto py-1 text-xs"
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
              <p className="font-medium text-sm">Developer</p>
              <WalletAddress
                address={props.developer}
                client={props.client}
                iconClassName="size-3"
                className="h-auto py-1 text-xs"
                fallbackIcon={
                  <div
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: developerColor,
                    }}
                  />
                }
              />
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 border-t border-dashed flex-col lg:flex-row flex lg:justify-between lg:items-center gap-4">
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
          <TransactionButton
            onClick={props.handleClaim}
            className="bg-background rounded-full"
            transactionCount={undefined}
            isPending={props.isClaimPending}
            txChainID={props.chain.id}
            isLoggedIn={true}
            client={props.client}
            disabled={!hasUnclaimedRewards}
            size="sm"
            variant="outline"
          >
            <SplitIcon className="size-3.5 text-muted-foreground" />
            Distribute Rewards
          </TransactionButton>
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
    decimals: number;
  };
  client: ThirdwebClient;
  chain: Chain;
  chainSlug: string;
}) {
  const fallbackIcon = (
    <div className="size-9 rounded-full from-muted to-card bg-gradient-to-br flex items-center justify-center text-muted-foreground font-bold uppercase">
      {props.token.symbol[0]}
    </div>
  );

  return (
    <div className="border p-3 rounded-xl flex items-center gap-3 min-w-[300px] bg-background relative hover:border-active-border">
      <div className="rounded-full border shrink-0">
        <TokenProvider
          address={props.token.address}
          client={props.client}
          chain={props.chain}
        >
          <TokenIcon
            className="size-9 rounded-full"
            loadingComponent={fallbackIcon}
            fallbackComponent={fallbackIcon}
          />
        </TokenProvider>
      </div>
      <div className="space-y-0.5">
        <p className="font-bold text-sm">
          {toTokens(props.token.amount, props.token.decimals)}{" "}
          {props.token.symbol}
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
