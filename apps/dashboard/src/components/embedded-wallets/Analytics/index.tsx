import { getInAppWalletUsage } from "@/api/analytics";
import {
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { Suspense } from "react";
import type { InAppWalletStats } from "../../../types/analytics";
import { RangeSelector } from "../../analytics/range-selector";
import { InAppWalletUsersChartCardUI } from "./InAppWalletUsersChartCard";

type InAppWalletAnalyticsProps = {
  interval: "day" | "week";
  range: Range;
  stats: InAppWalletStats[];
  isPending: boolean;
};

function InAppWalletAnalyticsInner({
  interval,
  range,
  stats,
  isPending,
}: InAppWalletAnalyticsProps) {
  return (
    <div>
      <RangeSelector range={range} interval={interval} />
      <div className="h-6" />
      <div className="flex flex-col gap-4 lg:gap-6">
        <InAppWalletUsersChartCardUI
          inAppWalletStats={stats || []}
          isPending={isPending}
          title="Unique Users"
          description="The total number of active in-app wallet users on your project."
        />
      </div>
    </div>
  );
}
type AsyncInAppWalletAnalyticsProps = Omit<
  InAppWalletAnalyticsProps,
  "stats" | "isPending"
> & {
  teamId: string;
  projectId: string;
};

async function AsyncInAppWalletAnalytics(
  props: AsyncInAppWalletAnalyticsProps,
) {
  const range = props.range ?? getLastNDaysRange("last-120");

  const stats = await getInAppWalletUsage({
    teamId: props.teamId,
    projectId: props.projectId,
    from: range.from,
    to: range.to,
    period: props.interval,
  }).catch((error) => {
    console.error(error);
    return [];
  });

  return (
    <InAppWalletAnalyticsInner
      {...props}
      stats={stats}
      range={range}
      isPending={false}
    />
  );
}

export function InAppWalletAnalytics(props: AsyncInAppWalletAnalyticsProps) {
  return (
    <Suspense
      fallback={
        <InAppWalletAnalyticsInner {...props} stats={[]} isPending={true} />
      }
    >
      <AsyncInAppWalletAnalytics {...props} />
    </Suspense>
  );
}
