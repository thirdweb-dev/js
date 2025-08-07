import { EmptyStateCard } from "app/(app)/team/components/Analytics/EmptyStateCard";
import { redirect } from "next/navigation";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { defineChain } from "thirdweb";
import { type ChainMetadata, getChainMetadata } from "thirdweb/chains";
import { getWalletInfo, type WalletId } from "thirdweb/wallets";
import {
  getClientTransactions,
  getInAppWalletUsage,
  getUniversalBridgeUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
} from "@/api/analytics";
import { getTeamBySlug } from "@/api/team/get-team";
import type {
  DurationId,
  Range,
} from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { getFiltersFromSearchParams } from "@/lib/time";
import type {
  InAppWalletStats,
  UserOpStats,
  WalletStats,
} from "@/types/analytics";
import { PieChartCard } from "../../../../components/Analytics/PieChartCard";
import { TotalSponsoredChartCardUI } from "../../_components/TotalSponsoredCard";
import { TransactionsChartCardWithChainMapping } from "../../_components/transaction-card-with-chain-mapping";
import { TeamHighlightsCard } from "./highlights-card";

type SearchParams = {
  usersChart?: string | string[];
  from?: string | string[];
  to?: string | string[];
  type?: string | string[];
  interval?: string | string[];
  client_transactions?: string | string[];
  appHighlights?: string | string[];
  userOpUsage?: string | string[];
};

export default async function TeamOverviewPage(props: {
  params: Promise<{ team_slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const defaultRange: DurationId = "last-30";
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange,
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <div className="flex grow flex-col">
        {/* header */}
        <div className="border-b">
          <div className="container max-w-7xl flex flex-col items-start gap-3 py-10 md:flex-row md:items-center">
            <div className="flex-1">
              <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
                Analytics
              </h1>
            </div>
            <div className="max-sm:w-full">
              <ResponsiveTimeFilters defaultRange={defaultRange} />
            </div>
          </div>
        </div>

        <div className="flex grow flex-col justify-between gap-10 container max-w-7xl pt-8 pb-16">
          <div className="flex grow flex-col gap-6">
            <ResponsiveSuspense
              searchParamsUsed={["appHighlights", "from", "to", "interval"]}
              fallback={<LoadingChartState className="h-[458px] border" />}
            >
              <AsyncTeamHighlightsCard
                selectedChartQueryParam="appHighlights"
                interval={interval}
                range={range}
                selectedChart={
                  typeof searchParams.appHighlights === "string"
                    ? searchParams.appHighlights
                    : undefined
                }
                teamId={team.id}
              />
            </ResponsiveSuspense>

            <div className="grid gap-6 md:grid-cols-2">
              <ResponsiveSuspense
                fallback={<LoadingChartState className="h-[431px] border" />}
                searchParamsUsed={["from", "to"]}
              >
                <AsyncWalletDistributionCard range={range} teamId={team.id} />
              </ResponsiveSuspense>

              <ResponsiveSuspense
                fallback={<LoadingChartState className="h-[431px] border" />}
                searchParamsUsed={["from", "to"]}
              >
                <AsyncAuthMethodDistributionCard
                  range={range}
                  teamId={team.id}
                />
              </ResponsiveSuspense>
            </div>

            <ResponsiveSuspense
              fallback={<LoadingChartState className="h-[458px] border" />}
              searchParamsUsed={[
                "from",
                "to",
                "interval",
                "client_transactions",
              ]}
            >
              <AsyncTransactionsChartCard
                selectedChartQueryParam="client_transactions"
                interval={interval}
                range={range}
                selectedChart={
                  typeof searchParams.client_transactions === "string"
                    ? searchParams.client_transactions
                    : undefined
                }
                teamId={team.id}
              />
            </ResponsiveSuspense>

            <ResponsiveSuspense
              fallback={<LoadingChartState className="h-[458px] border" />}
              searchParamsUsed={["from", "to", "interval", "userOpUsage"]}
            >
              <AsyncTotalSponsoredCard
                selectedChartQueryParam="userOpUsage"
                interval={interval}
                range={range}
                selectedChart={
                  typeof searchParams.userOpUsage === "string"
                    ? searchParams.userOpUsage
                    : undefined
                }
                teamId={team.id}
              />
            </ResponsiveSuspense>
          </div>
        </div>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}

async function AsyncTeamHighlightsCard(props: {
  teamId: string;
  range: Range;
  interval: "day" | "week";
  selectedChart: string | undefined;
  selectedChartQueryParam: string;
}) {
  const [walletUserStatsTimeSeries, universalBridgeUsage] =
    await Promise.allSettled([
      getWalletUsers({
        from: props.range.from,
        period: props.interval,
        teamId: props.teamId,
        to: props.range.to,
      }),
      getUniversalBridgeUsage({
        from: props.range.from,
        period: props.interval,
        teamId: props.teamId,
        to: props.range.to,
      }),
    ]);

  if (
    walletUserStatsTimeSeries.status === "fulfilled" &&
    universalBridgeUsage.status === "fulfilled" &&
    walletUserStatsTimeSeries.value.some((w) => w.totalUsers !== 0)
  ) {
    return (
      <TeamHighlightsCard
        selectedChart={props.selectedChart}
        userStats={walletUserStatsTimeSeries.value}
        selectedChartQueryParam={props.selectedChartQueryParam}
        volumeStats={universalBridgeUsage.value}
      />
    );
  }

  return (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets"
      metric="Wallets"
    />
  );
}

async function AsyncWalletDistributionCard(props: {
  teamId: string;
  range: Range;
}) {
  const walletConnections = await getWalletConnections({
    from: props.range.from,
    period: "all",
    teamId: props.teamId,
    to: props.range.to,
  }).catch(() => undefined);

  return walletConnections && walletConnections.length > 0 ? (
    <WalletDistributionCard data={walletConnections} />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets"
      metric="Wallets"
    />
  );
}

async function AsyncAuthMethodDistributionCard(props: {
  teamId: string;
  range: Range;
}) {
  const inAppWalletUsage = await getInAppWalletUsage({
    from: props.range.from,
    period: "all",
    teamId: props.teamId,
    to: props.range.to,
  }).catch(() => undefined);

  return inAppWalletUsage && inAppWalletUsage.length > 0 ? (
    <AuthMethodDistributionCard data={inAppWalletUsage} />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/typescript/v5/inAppWallet"
      metric="Wallets"
    />
  );
}

async function AsyncTransactionsChartCard(props: {
  teamId: string;
  range: Range;
  interval: "day" | "week";
  selectedChart: string | undefined;
  selectedChartQueryParam: string;
}) {
  const [clientTransactionsTimeSeries, clientTransactions] =
    await Promise.allSettled([
      getClientTransactions({
        from: props.range.from,
        period: props.interval,
        teamId: props.teamId,
        to: props.range.to,
      }),
      getClientTransactions({
        from: props.range.from,
        period: "all",
        teamId: props.teamId,
        to: props.range.to,
      }),
    ]);

  return clientTransactionsTimeSeries.status === "fulfilled" &&
    clientTransactions.status === "fulfilled" &&
    clientTransactions.value.length > 0 ? (
    <TransactionsChartCardWithChainMapping
      selectedChartQueryParam={props.selectedChartQueryParam}
      aggregatedData={clientTransactions.value}
      data={clientTransactionsTimeSeries.value}
      selectedChart={props.selectedChart}
    />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets"
      metric="Wallets"
    />
  );
}

async function AsyncTotalSponsoredCard(props: {
  teamId: string;
  range: Range;
  interval: "day" | "week";
  selectedChart: string | undefined;
  selectedChartQueryParam: string;
}) {
  const [userOpUsageTimeSeries, userOpUsage] = await Promise.allSettled([
    getUserOpUsage({
      from: props.range.from,
      period: props.interval,
      teamId: props.teamId,
      to: props.range.to,
    }),
    getUserOpUsage({
      from: props.range.from,
      period: "all",
      teamId: props.teamId,
      to: props.range.to,
    }),
  ]);

  return userOpUsageTimeSeries.status === "fulfilled" &&
    userOpUsage.status === "fulfilled" &&
    userOpUsage.value.length > 0 ? (
    <AsyncTotalSponsoredChartCard
      aggregatedData={userOpUsage.value}
      data={userOpUsageTimeSeries.value}
      selectedChart={props.selectedChart}
      selectedChartQueryParam={props.selectedChartQueryParam}
    />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
      metric="Account Abstraction"
    />
  );
}

async function WalletDistributionCard({ data }: { data: WalletStats[] }) {
  const formattedData = await Promise.all(
    data
      .filter((w) => w.walletType !== "smart" && w.walletType !== "smartWallet")
      .map(async (w) => {
        const wallet = await getWalletInfo(w.walletType as WalletId).catch(
          () => ({ name: w.walletType }),
        );
        return {
          totalConnections: w.totalConnections,
          uniqueWalletsConnected: w.uniqueWalletsConnected,
          walletName: wallet.name,
          walletType: w.walletType,
        };
      }),
  );

  return (
    <PieChartCard
      data={formattedData.map(({ walletName, uniqueWalletsConnected }) => {
        return {
          label: walletName,
          value: uniqueWalletsConnected,
        };
      })}
      title="Wallets Connected"
    />
  );
}

function AuthMethodDistributionCard({ data }: { data: InAppWalletStats[] }) {
  return (
    <PieChartCard
      data={data.map(({ authenticationMethod, uniqueWalletsConnected }) => ({
        label: authenticationMethod,
        value: uniqueWalletsConnected,
      }))}
      title="Social Authentication"
    />
  );
}

async function AsyncTotalSponsoredChartCard(props: {
  data: UserOpStats[];
  aggregatedData: UserOpStats[];
  selectedChart: string | undefined;
  className?: string;
  onlyMainnet?: boolean;
  title?: string;
  selectedChartQueryParam: string;
  description?: string;
}) {
  const chains = await Promise.all(
    props.data.map(
      (item) =>
        // eslint-disable-next-line no-restricted-syntax
        item.chainId && getChainMetadata(defineChain(Number(item.chainId))),
    ),
  ).then((chains) => chains.filter((c) => c) as ChainMetadata[]);

  const processedAggregatedData = {
    mainnet: props.aggregatedData
      .filter(
        (d) => !chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
    testnet: props.aggregatedData
      .filter(
        (d) => chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
    total: props.aggregatedData.reduce(
      (acc, curr) => acc + curr.sponsoredUsd,
      0,
    ),
  };

  return (
    <TotalSponsoredChartCardUI
      chains={chains}
      processedAggregatedData={processedAggregatedData}
      selectedChart={props.selectedChart}
      selectedChartQueryParam={props.selectedChartQueryParam}
      data={props.data}
    />
  );
}
