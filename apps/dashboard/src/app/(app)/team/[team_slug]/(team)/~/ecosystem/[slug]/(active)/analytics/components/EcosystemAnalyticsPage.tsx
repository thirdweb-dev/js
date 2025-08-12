import { Suspense } from "react";
import { ResponsiveSuspense } from "responsive-rsc";
import { getEcosystemWalletUsage } from "@/api/analytics";
import type { Partner } from "@/api/team/ecosystems";
import type {
  DurationId,
  Range,
} from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import type { EcosystemWalletStats } from "@/types/analytics";
import { EcosystemWalletUsersChartCard } from "./EcosystemWalletUsersChartCard";
import { EcosystemWalletsSummary } from "./Summary";

export async function EcosystemAnalyticsPage({
  ecosystemSlug,
  teamId,
  interval,
  range,
  partners,
  defaultRange,
  authToken,
}: {
  ecosystemSlug: string;
  teamId: string;
  interval: "day" | "week";
  range: Range;
  defaultRange: DurationId;
  partners: Partner[];
  authToken: string;
}) {
  return (
    <div>
      <Suspense
        fallback={
          <EcosystemWalletsSummary
            allTimeStats={[]}
            monthlyStats={[]}
            isPending={true}
          />
        }
      >
        <AsyncEcosystemWalletsSummary
          ecosystemSlug={ecosystemSlug}
          teamId={teamId}
          authToken={authToken}
        />
      </Suspense>

      <div className="h-6" />

      <ResponsiveTimeFilters defaultRange={defaultRange} />

      <div className="h-6" />

      <ResponsiveSuspense
        searchParamsUsed={["from", "to", "interval"]}
        fallback={
          <EcosystemWalletUsersAnalyticsUI
            ecosystemWalletStats={[]}
            groupBy="authenticationMethod"
            isPending={true}
            partners={partners}
          />
        }
      >
        <AsyncEcosystemWalletUsersAnalytics
          ecosystemSlug={ecosystemSlug}
          interval={interval}
          partners={partners}
          range={range}
          teamId={teamId}
          authToken={authToken}
        />
      </ResponsiveSuspense>
    </div>
  );
}

async function AsyncEcosystemWalletsSummary(props: {
  ecosystemSlug: string;
  teamId: string;
  authToken: string;
}) {
  const { ecosystemSlug, teamId, authToken } = props;

  const allTimeStatsPromise = getEcosystemWalletUsage(
    {
      ecosystemSlug,
      from: new Date(2022, 0, 1),
      period: "all",
      teamId,
      to: new Date(),
    },
    authToken,
  );

  const monthlyStatsPromise = getEcosystemWalletUsage(
    {
      ecosystemSlug,
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      period: "month",
      teamId,
      to: new Date(),
    },
    authToken,
  );

  const [allTimeStats, monthlyStats] = await Promise.all([
    allTimeStatsPromise,
    monthlyStatsPromise,
  ]);

  return (
    <EcosystemWalletsSummary
      allTimeStats={allTimeStats ?? []}
      monthlyStats={monthlyStats ?? []}
      isPending={false}
    />
  );
}

async function AsyncEcosystemWalletUsersAnalytics(props: {
  ecosystemSlug: string;
  teamId: string;
  interval: "day" | "week";
  range: Range;
  partners: Partner[];
  authToken: string;
}) {
  const { ecosystemSlug, teamId, interval, range, partners, authToken } = props;

  const stats = await getEcosystemWalletUsage(
    {
      ecosystemSlug,
      from: range.from,
      period: interval,
      teamId,
      to: range.to,
    },
    authToken,
  ).catch(() => null);

  return (
    <EcosystemWalletUsersAnalyticsUI
      ecosystemWalletStats={stats || []}
      groupBy="authenticationMethod"
      isPending={false}
      partners={partners}
    />
  );
}

function EcosystemWalletUsersAnalyticsUI(props: {
  ecosystemWalletStats: EcosystemWalletStats[];
  isPending: boolean;
  groupBy: "authenticationMethod" | "ecosystemPartnerId";
  partners: Partner[];
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <EcosystemWalletUsersChartCard
        ecosystemWalletStats={props.ecosystemWalletStats || []}
        groupBy="authenticationMethod"
        isPending={props.isPending}
        partners={props.partners}
      />
      <EcosystemWalletUsersChartCard
        ecosystemWalletStats={props.ecosystemWalletStats || []}
        groupBy="ecosystemPartnerId"
        isPending={props.isPending}
        partners={props.partners}
      />
    </div>
  );
}
