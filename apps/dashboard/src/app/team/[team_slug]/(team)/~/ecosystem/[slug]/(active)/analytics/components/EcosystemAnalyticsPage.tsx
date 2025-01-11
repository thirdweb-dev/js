import {
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { RangeSelector } from "components/analytics/range-selector";
import { getEcosystemWalletUsage } from "data/analytics/wallets/ecosystem";
import { EcosystemWalletUsersChartCard } from "./EcosystemWalletUsersChartCard";

export async function EcosystemAnalyticsPage({
  ecosystemSlug,
  interval,
  range,
}: { ecosystemSlug: string; interval: "day" | "week"; range?: Range }) {
  if (!range) {
    range = getLastNDaysRange("last-120");
  }

  const stats = await getEcosystemWalletUsage({
    ecosystemSlug,
    from: range.from,
    to: range.to,
    period: interval,
  }).catch(() => null);

  return (
    <div>
      <RangeSelector range={range} interval={interval} />

      <div className="h-6" />

      <div className="flex flex-col gap-4 lg:gap-6">
        <EcosystemWalletUsersChartCard
          ecosystemWalletStats={stats || []}
          isPending={false}
        />
      </div>
    </div>
  );
}
