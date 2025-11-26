import { EmptyStateCard } from "app/(app)/team/components/Analytics/EmptyStateCard";
import { redirect } from "next/navigation";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { getWalletInfo, type WalletId } from "thirdweb/wallets";
import {
  getClientTransactions,
  getInAppWalletUsage,
  getUniversalBridgeUsage,
  getWalletConnections,
} from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team/get-team";
import type {
  DurationId,
  Range,
} from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { getFiltersFromSearchParams } from "@/lib/time";
import type { InAppWalletStats, WalletStats } from "@/types/analytics";
import { loginRedirect } from "@/utils/redirects";
import { PieChartCard } from "../../../../components/Analytics/PieChartCard";
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

  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/analytics`);
  }

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
                authToken={authToken}
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
                <AsyncWalletDistributionCard
                  range={range}
                  teamId={team.id}
                  authToken={authToken}
                />
              </ResponsiveSuspense>

              <ResponsiveSuspense
                fallback={<LoadingChartState className="h-[431px] border" />}
                searchParamsUsed={["from", "to"]}
              >
                <AsyncAuthMethodDistributionCard
                  range={range}
                  teamId={team.id}
                  authToken={authToken}
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
                authToken={authToken}
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
  authToken: string;
}) {
  const [walletUserStatsTimeSeries, universalBridgeUsage] =
    await Promise.allSettled([
      getInAppWalletUsage(
        {
          from: props.range.from,
          period: props.interval,
          teamId: props.teamId,
          to: props.range.to,
        },
        props.authToken,
      ),
      getUniversalBridgeUsage(
        {
          from: props.range.from,
          period: props.interval,
          teamId: props.teamId,
          to: props.range.to,
        },
        props.authToken,
      ),
    ]);

  if (
    walletUserStatsTimeSeries.status === "fulfilled" &&
    universalBridgeUsage.status === "fulfilled" &&
    walletUserStatsTimeSeries.value.some((w) => w.uniqueWalletsConnected !== 0)
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
  authToken: string;
}) {
  const walletConnections = await getWalletConnections(
    {
      from: props.range.from,
      period: "all",
      teamId: props.teamId,
      to: props.range.to,
    },
    props.authToken,
  ).catch(() => undefined);

  return walletConnections && walletConnections.length > 0 ? (
    <WalletDistributionCard data={walletConnections} />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets/external-wallets"
      metric="External Wallets"
    />
  );
}

async function AsyncAuthMethodDistributionCard(props: {
  teamId: string;
  range: Range;
  authToken: string;
}) {
  const inAppWalletUsage = await getInAppWalletUsage(
    {
      from: props.range.from,
      period: "all",
      teamId: props.teamId,
      to: props.range.to,
    },
    props.authToken,
  ).catch(() => undefined);

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
  authToken: string;
}) {
  const [clientTransactionsTimeSeries, clientTransactions] =
    await Promise.allSettled([
      getClientTransactions(
        {
          from: props.range.from,
          period: props.interval,
          teamId: props.teamId,
          to: props.range.to,
        },
        props.authToken,
      ),
      getClientTransactions(
        {
          from: props.range.from,
          period: "all",
          teamId: props.teamId,
          to: props.range.to,
        },
        props.authToken,
      ),
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

async function WalletDistributionCard({ data }: { data: WalletStats[] }) {
  const formattedData = await Promise.all(
    data.map(async (w) => {
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
      title="External Wallets Connected"
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
