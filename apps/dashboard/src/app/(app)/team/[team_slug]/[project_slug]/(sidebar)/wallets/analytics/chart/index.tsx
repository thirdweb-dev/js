import { ResponsiveSuspense } from "responsive-rsc";
import { getInAppWalletUsage } from "@/api/analytics";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import type { InAppWalletStats } from "@/types/analytics";
import { InAppWalletUsersChartCardUI } from "./InAppWalletUsersChartCard";

type InAppWalletAnalyticsProps = {
  interval: "day" | "week";
  range: Range;
  stats: InAppWalletStats[];
  isPending: boolean;
};

function InAppWalletAnalyticsUI({
  stats,
  isPending,
}: InAppWalletAnalyticsProps) {
  return (
    <InAppWalletUsersChartCardUI
      title="Unique Users"
      description="The total number of active user wallet users on your project."
      inAppWalletStats={stats || []}
      isPending={isPending}
    />
  );
}

type AsyncInAppWalletAnalyticsProps = Omit<
  InAppWalletAnalyticsProps,
  "stats" | "isPending"
> & {
  teamId: string;
  projectId: string;
  authToken: string;
};

async function AsyncInAppWalletAnalytics(
  props: AsyncInAppWalletAnalyticsProps,
) {
  const range = props.range ?? getLastNDaysRange("last-30");

  const stats = await getInAppWalletUsage(
    {
      from: range.from,
      period: props.interval,
      projectId: props.projectId,
      teamId: props.teamId,
      to: range.to,
    },
    props.authToken,
  ).catch((error) => {
    console.error(error);
    return [];
  });

  return (
    <InAppWalletAnalyticsUI
      {...props}
      isPending={false}
      range={range}
      stats={stats}
    />
  );
}

export function InAppWalletAnalytics(props: AsyncInAppWalletAnalyticsProps) {
  return (
    <ResponsiveSuspense
      searchParamsUsed={["from", "to", "interval"]}
      fallback={
        <InAppWalletAnalyticsUI {...props} isPending={true} stats={[]} />
      }
    >
      <AsyncInAppWalletAnalytics {...props} />
    </ResponsiveSuspense>
  );
}
