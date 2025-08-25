import { ResponsiveSuspense } from "responsive-rsc";
import { getAiUsage } from "@/api/analytics";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import type { AIUsageStats } from "@/types/analytics";
import { AiTokenUsageChartCardUI } from "./AiTokenUsageChartCard";

type AiAnalyticsProps = {
  interval: "day" | "week";
  range: Range;
  stats: AIUsageStats[];
  isPending: boolean;
};

function AiAnalyticsUI({
  stats,
  isPending,
}: AiAnalyticsProps) {
  return (
    <AiTokenUsageChartCardUI
      title="Token Usage"
      description="The total number of tokens used for AI interactions on your project."
      aiUsageStats={stats || []}
      isPending={isPending}
    />
  );
}

type AsyncAiAnalyticsProps = Omit<
  AiAnalyticsProps,
  "stats" | "isPending"
> & {
  teamId: string;
  projectId: string;
  authToken: string;
};

async function AsyncAiAnalytics(
  props: AsyncAiAnalyticsProps,
) {
  const range = props.range ?? getLastNDaysRange("last-30");

  const stats = await getAiUsage(
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
    <AiAnalyticsUI
      {...props}
      isPending={false}
      range={range}
      stats={stats}
    />
  );
}

export function AiAnalytics(props: AsyncAiAnalyticsProps) {
  return (
    <ResponsiveSuspense
      searchParamsUsed={["from", "to", "interval"]}
      fallback={
        <AiAnalyticsUI {...props} isPending={true} stats={[]} />
      }
    >
      <AsyncAiAnalytics {...props} />
    </ResponsiveSuspense>
  );
}