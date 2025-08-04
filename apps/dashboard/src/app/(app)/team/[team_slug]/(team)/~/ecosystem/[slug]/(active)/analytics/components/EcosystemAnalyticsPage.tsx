import { getEcosystemWalletUsage } from "@/api/analytics";
import type { Partner } from "@/api/team/ecosystems";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { RangeSelector } from "@/components/analytics/range-selector";
import { EcosystemWalletUsersChartCard } from "./EcosystemWalletUsersChartCard";
import { EcosystemWalletsSummary } from "./Summary";

export async function EcosystemAnalyticsPage({
  ecosystemSlug,
  teamId,
  interval,
  range,
  partners,
}: {
  ecosystemSlug: string;
  teamId: string;
  interval: "day" | "week";
  range?: Range;
  partners: Partner[];
}) {
  if (!range) {
    range = getLastNDaysRange("last-120");
  }

  const allTimeStatsPromise = getEcosystemWalletUsage({
    ecosystemSlug,
    from: new Date(2022, 0, 1),
    period: "all",
    teamId,
    to: new Date(),
  });

  const monthlyStatsPromise = getEcosystemWalletUsage({
    ecosystemSlug,
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    period: "month",
    teamId,
    to: new Date(),
  });

  const statsPromise = getEcosystemWalletUsage({
    ecosystemSlug,
    from: range.from,
    period: interval,
    teamId,
    to: range.to,
  }).catch(() => null);

  const [allTimeStats, monthlyStats, stats] = await Promise.all([
    allTimeStatsPromise,
    monthlyStatsPromise,
    statsPromise,
  ]);

  return (
    <div>
      <EcosystemWalletsSummary
        allTimeStats={allTimeStats ?? []}
        monthlyStats={monthlyStats ?? []}
      />

      <div className="h-6" />

      <RangeSelector interval={interval} range={range} />

      <div className="h-6" />

      <div className="flex flex-col gap-4 lg:gap-6">
        <EcosystemWalletUsersChartCard
          ecosystemWalletStats={stats || []}
          groupBy="authenticationMethod"
          isPending={false}
          partners={partners}
        />
        <EcosystemWalletUsersChartCard
          ecosystemWalletStats={stats || []}
          groupBy="ecosystemPartnerId"
          isPending={false}
          partners={partners}
        />
      </div>
    </div>
  );
}
