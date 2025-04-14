import { getInAppWalletUsage, getUserOpUsage } from "@/api/analytics";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import type { RPCUsageDataItem } from "@/api/usage/rpc";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { Button } from "@/components/ui/button";
import type {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { InAppWalletUsersChartCardUI } from "components/embedded-wallets/Analytics/InAppWalletUsersChartCard";
import { subMonths } from "date-fns";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { TotalSponsoredChartCardUI } from "../../../../_components/TotalSponsoredCard";
import { SponsoredTransactionsTable } from "./SponsoredTransactionsTable";
import { UsageCard } from "./UsageCard";

type UsageProps = {
  // TODO - remove when we have all the data available from team
  usage: UsageBillableByService;
  subscriptions: TeamSubscription[];
  account: Account;
  team: Team;
  client: ThirdwebClient;
  projects: {
    id: string;
    name: string;
    image: string | null;
    slug: string;
  }[];
  rpcUsage: RPCUsageDataItem[];
};

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  notation: "compact",
});

export const Usage: React.FC<UsageProps> = ({
  usage: usageData,
  subscriptions,
  account,
  team,
  client,
  projects,
  rpcUsage,
}) => {
  const gatewayMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    return {
      title: "Unlimited Requests",
      total: (
        <span className="text-muted-foreground">
          {compactNumberFormatter.format(usageData.rateLimits.storage)} Requests
          Per Second
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

  const storageUsage = team.capabilities.storage.upload;

  const rpcUsageData = useMemo(() => {
    const mappedRPCUsage = rpcUsage.reduce(
      (acc, curr) => {
        switch (curr.usageType) {
          case "rate-limit":
            acc[curr.date] = {
              ...(acc[curr.date] || {}),
              "rate-limit":
                (acc[curr.date]?.["rate-limit"] || 0) + Number(curr.count),
              included: acc[curr.date]?.included || 0,
            };
            break;
          default:
            acc[curr.date] = {
              ...(acc[curr.date] || {}),
              "rate-limit": acc[curr.date]?.["rate-limit"] || 0,
              included: (acc[curr.date]?.included || 0) + Number(curr.count),
            };
            break;
        }
        return acc;
      },
      {} as Record<string, { included: number; "rate-limit": number }>,
    );

    return Object.entries(mappedRPCUsage).map(([date, usage]) => ({
      time: new Date(date).getTime(),
      ...usage,
    }));
  }, [rpcUsage]);

  return (
    <div className="flex grow flex-col gap-8">
      <InAppWalletUsersChartCard
        teamId={team.id}
        accountId={account.id}
        from={currentPeriodStart}
        to={currentPeriodEnd}
      />

      <TotalSponsoredCard
        teamId={team.id}
        accountId={account.id}
        from={currentPeriodStart}
        to={currentPeriodEnd}
      />

      <SponsoredTransactionsTable
        client={client}
        teamSlug={team.slug}
        teamId={team.id}
        from={currentPeriodStart.toISOString()}
        to={currentPeriodEnd.toISOString()}
        projects={projects}
        variant="team"
      />

      <ThirdwebBarChart
        header={{
          title: "RPC Requests",
          description: `Your plan allows for ${usageData.rateLimits.rpc} requests per second`,
          titleClassName: "text-xl mb-0.5",
        }}
        data={rpcUsageData}
        isPending={false}
        variant="stacked"
        config={{
          included: {
            label: "RPC Requests",
            color: "hsl(var(--chart-1))",
          },
          "rate-limit": {
            label: "Rate Limited Requests",
            color: "hsl(var(--chart-3))",
          },
        }}
        chartClassName="aspect-[1.5] lg:aspect-[4]"
      />

      <UsageCard
        {...gatewayMetrics}
        name="Storage Gateway"
        description="Amount of storage gateway requests allowed per second in your plan"
      />

      <UsageCard
        title={`${formatStorageBytes(storageUsage.totalFileSizeBytesLimit)} Storage`}
        total={
          storageUsage.rateLimit > 10_000 ? undefined : (
            <p className="text-muted-foreground">
              {compactNumberFormatter.format(storageUsage.rateLimit)} Requests
              Per Second
            </p>
          )
        }
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
  teamId: string;
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
    teamId: props.teamId,
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
  const { teamId, from, to } = props;
  const [userOpUsageTimeSeries, userOpUsage] = await Promise.all([
    // User operations usage
    getUserOpUsage({
      teamId,
      from: from,
      to: to,
      period: "week",
    }),
    getUserOpUsage({
      teamId,
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

function formatStorageBytes(bytes: number) {
  const ONE_KB = 1024;
  const ONE_MB = ONE_KB * 1024;
  const ONE_GB = ONE_MB * 1024;

  if (bytes < ONE_KB) {
    return `${bytes} bytes`;
  }

  if (bytes < ONE_MB) {
    return `${compactNumberFormatter.format(bytes / ONE_KB)} KB`;
  }

  if (bytes < ONE_GB) {
    return `${compactNumberFormatter.format(bytes / ONE_MB)} MB`;
  }

  const gbs = bytes / ONE_GB;

  if (gbs > 1000) {
    return "Unlimited";
  }

  return `${compactNumberFormatter.format(gbs)} GB`;
}
