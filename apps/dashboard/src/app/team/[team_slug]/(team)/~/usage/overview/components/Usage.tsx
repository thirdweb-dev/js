import { getInAppWalletUsage, getUserOpUsage } from "@/api/analytics";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { Button } from "@/components/ui/button";
import type {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { InAppWalletUsersChartCardUI } from "components/embedded-wallets/Analytics/InAppWalletUsersChartCard";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { toPercent, toSize } from "utils/number";
import { TotalSponsoredChartCardUI } from "../../../../_components/TotalSponsoredCard";
import { UsageCard } from "./UsageCard";

type UsageProps = {
  usage: UsageBillableByService;
  subscriptions: TeamSubscription[];
  account: Account;
  team: Team;
};

export const Usage: React.FC<UsageProps> = ({
  usage: usageData,
  subscriptions,
  account,
  team,
}) => {
  const storageMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    const consumedBytes = usageData.usage.storage.sumFileSizeBytes;
    const limitBytes = usageData.limits.storage;
    const percent = toPercent(consumedBytes, limitBytes);

    return {
      total: `${toSize(consumedBytes, "MB")} / ${toSize(
        limitBytes,
      )} (${percent}%)`,
      progress: percent,
      ...(usageData.billableUsd.storage > 0
        ? {
            overage: usageData.billableUsd.storage,
          }
        : {}),
    };
  }, [usageData]);

  const rpcMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    return {
      title: "Unlimited Requests",
      total: (
        <span className="text-muted-foreground">
          {usageData.rateLimits.rpc} Requests Per Second
        </span>
      ),
    };
  }, [usageData]);

  const gatewayMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    return {
      title: "Unlimited Requests",
      total: (
        <span className="text-muted-foreground">
          {usageData.rateLimits.storage} Requests Per Second
        </span>
      ),
    };
  }, [usageData]);

  const usageSub = subscriptions.find((sub) => sub.type === "USAGE");

  return (
    <div className="flex grow flex-col gap-8">
      {usageSub && (
        <>
          <InAppWalletUsersChartCard
            accountId={account.id}
            from={new Date(usageSub.currentPeriodStart)}
            to={new Date(usageSub.currentPeriodEnd)}
          />

          <TotalSponsoredCard
            accountId={account.id}
            from={new Date(usageSub.currentPeriodStart)}
            to={new Date(usageSub.currentPeriodEnd)}
          />
        </>
      )}

      <UsageCard
        {...rpcMetrics}
        name="RPC"
        description="Amount of RPC requests allowed per second in your plan"
      />

      <UsageCard
        {...gatewayMetrics}
        name="Storage Gateway"
        description="Amount of storage gateway requests allowed per second in your plan"
      />

      <UsageCard
        {...storageMetrics}
        name="Storage Pinning"
        description="Amount of IPFS Storage pinning allowed in your plan"
      >
        <Button
          variant="outline"
          className="top-6 right-6 mt-6 md:absolute md:mt-0"
          asChild
          size="sm"
        >
          <Link href={`/team/${team.slug}/~/usage/storage`}>
            View Pinned Files
          </Link>
        </Button>
      </UsageCard>
    </div>
  );
};

type ChartCardProps = {
  from: Date;
  to: Date;
  accountId: string;
};

function InAppWalletUsersChartCard(props: ChartCardProps) {
  const title = "In-App Wallets";
  const description =
    "Number of unique users interacting with your apps using in-app wallets every day";

  return (
    <Suspense
      fallback={
        <InAppWalletUsersChartCardUI
          inAppWalletStats={[]}
          isPending={true}
          title={title}
          description={description}
        />
      }
    >
      <AsyncInAppWalletUsersChartCard
        {...props}
        title={title}
        description={description}
      />
    </Suspense>
  );
}

async function AsyncInAppWalletUsersChartCard(
  props: ChartCardProps & {
    title: string;
    description: string;
  },
) {
  const inAppWalletUsage = await getInAppWalletUsage({
    period: "day",
    from: props.from,
    to: props.to,
    accountId: props.accountId,
  }).catch(() => null);

  return (
    <InAppWalletUsersChartCardUI
      inAppWalletStats={inAppWalletUsage || []}
      isPending={false}
      title={props.title}
      description={props.description}
    />
  );
}

function TotalSponsoredCard(props: ChartCardProps) {
  const title = "Total Sponsored";
  const description =
    "Total amount of USD sponsored across all mainnets with account abstraction";

  return (
    <Suspense
      fallback={
        <TotalSponsoredChartCardUI
          data={[]}
          aggregatedData={[]}
          className="bg-muted/50"
          onlyMainnet
          description={description}
          title={title}
        />
      }
    >
      <AsyncTotalSponsoredChartCard
        {...props}
        title={title}
        description={description}
      />
    </Suspense>
  );
}

async function AsyncTotalSponsoredChartCard(
  props: ChartCardProps & {
    description: string;
    title: string;
  },
) {
  const { accountId, from, to } = props;
  const [userOpUsageTimeSeries, userOpUsage] = await Promise.all([
    // User operations usage
    getUserOpUsage({
      accountId: accountId,
      from: from,
      to: to,
      period: "week",
    }),
    getUserOpUsage({
      accountId: accountId,
      from: from,
      to: to,
      period: "all",
    }),
  ]);

  return (
    <TotalSponsoredChartCardUI
      data={userOpUsageTimeSeries}
      aggregatedData={userOpUsage}
      className="bg-muted/50"
      onlyMainnet
      description={props.description}
      title={props.title}
    />
  );
}
