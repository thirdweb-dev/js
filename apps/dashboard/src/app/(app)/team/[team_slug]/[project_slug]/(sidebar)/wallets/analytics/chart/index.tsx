import { Suspense } from "react";
import { getInAppWalletUsage } from "@/api/analytics";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { RangeSelector } from "@/components/analytics/range-selector";
import type { InAppWalletStats } from "../../../../../../../../../@/types/analytics";
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
      <RangeSelector interval={interval} range={range} />
      <div className="h-6" />
      <div className="flex flex-col gap-4 lg:gap-6">
        <InAppWalletUsersChartCardUI
          description="The total number of active in-app wallet users on your project."
          inAppWalletStats={stats || []}
          isPending={isPending}
          title="Unique Users"
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
    from: range.from,
    period: props.interval,
    projectId: props.projectId,
    teamId: props.teamId,
    to: range.to,
  }).catch((error) => {
    console.error(error);
    return [];
  });

  return (
    <InAppWalletAnalyticsInner
      {...props}
      isPending={false}
      range={range}
      stats={stats}
    />
  );
}

export function InAppWalletAnalytics(props: AsyncInAppWalletAnalyticsProps) {
  return (
    <Suspense
      fallback={
        <InAppWalletAnalyticsInner {...props} isPending={true} stats={[]} />
      }
    >
      <AsyncInAppWalletAnalytics {...props} />
    </Suspense>
  );
}
