import {
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { getInAppWalletUsage } from "data/analytics/wallets/in-app";
import { InAppWalletUsersChartCard } from "./InAppWalletUsersChartCard";
import { RangeSelector } from "./RangeSelector";

export async function InAppWalletAnalytics({
  clientId,
  interval,
  range,
}: { clientId: string; interval: "day" | "week"; range?: Range }) {
  if (!range) {
    range = getLastNDaysRange("last-120");
  }

  const stats = await getInAppWalletUsage({
    clientId,
    from: range.from,
    to: range.to,
    period: interval,
  });

  return (
    <div>
      <RangeSelector range={range} interval={interval} />

      <div className="h-6" />

      <div className="flex flex-col gap-4 lg:gap-6">
        <InAppWalletUsersChartCard inAppWalletStats={stats} isPending={false} />
      </div>
    </div>
  );
}
