import { getInAppWalletUsage, getUserOpUsage } from "@/api/analytics";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { Button } from "@/components/ui/button";
import type {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { InAppWalletUsersChartCardUI } from "components/embedded-wallets/Analytics/InAppWalletUsersChartCard";
import { subMonths } from "date-fns";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { toPercent, toSize } from "utils/number";
import { TotalSponsoredChartCardUI } from "../../../../_components/TotalSponsoredCard";
import { UsageCard } from "./UsageCard";

type UsageProps = {
  // TODO - remove when we have all the data available from team
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
  // TODO - get this from team instead of account
  const storageMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    const consumedBytes = usageData.usage.storage.sumFileSizeBytes;
    const limitBytes = usageData.limits.storage;
    const percent = toPercent(consumedBytes, limitBytes);

    return {
      total: `${toSize(Math.min(consumedBytes, limitBytes), "MB")} of ${toSize(limitBytes)} included storage used`,
      progress: percent,
      totalUsage: `Total Usage: ${toSize(consumedBytes, "MB")}`,
    };
  }, [usageData]);

  // TODO - get this from team instead of account
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

  // we don't have `usageSub` for free plan - so we use "1 month ago" as the period
  // even free plan can have usage data

  const currentPeriodStart = usageSub?.currentPeriodStart
    ? new Date(usageSub.currentPeriodStart)
    : subMonths(new Date(), 1);

  const currentPeriodEnd = usageSub?.currentPeriodEnd
    ? new Date(usageSub.currentPeriodEnd)
    : new Date();

  return (
    <div className="flex grow flex-col gap-8">
      <InAppWalletUsersChartCard
        accountId={account.id}
        from={currentPeriodStart}
        to={currentPeriodEnd}
      />

      <TotalSponsoredCard
        accountId={account.id}
        from={currentPeriodStart}
        to={currentPeriodEnd}
      />

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
          className="bg-card"
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
      className="bg-card"
      onlyMainnet
      description={props.description}
      title={props.title}
    />
  );
}
