import { getEcosystemWalletUsage } from "@/api/analytics";
import {
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { RangeSelector } from "components/analytics/range-selector";
import type { Partner } from "../../../../types";
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
    teamId,
    from: new Date(2022, 0, 1),
    to: new Date(),
    period: "all",
  });

  const monthlyStatsPromise = getEcosystemWalletUsage({
    ecosystemSlug,
    teamId,
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
    period: "month",
  });

  const statsPromise = getEcosystemWalletUsage({
    ecosystemSlug,
    teamId,
    from: range.from,
    to: range.to,
    period: interval,
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

      <RangeSelector range={range} interval={interval} />

      <div className="h-6" />

      <div className="flex flex-col gap-4 lg:gap-6">
        <EcosystemWalletUsersChartCard
          ecosystemWalletStats={stats || []}
          isPending={false}
          groupBy="authenticationMethod"
          partners={partners}
        />
        <EcosystemWalletUsersChartCard
          ecosystemWalletStats={stats || []}
          isPending={false}
          groupBy="ecosystemPartnerId"
          partners={partners}
        />
      </div>
    </div>
  );
}
