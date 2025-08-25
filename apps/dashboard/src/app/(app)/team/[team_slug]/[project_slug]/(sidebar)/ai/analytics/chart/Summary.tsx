import { ActivityIcon, MessageSquareIcon, CoinsIcon } from "lucide-react";
import { Suspense } from "react";
import { getAiUsage } from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { StatCard } from "@/components/analytics/stat";
import type { AIUsageStats } from "@/types/analytics";

function AiSummaryInner(props: {
  stats: AIUsageStats[] | undefined;
  isPending: boolean;
}) {
  const totalRequests = props.stats?.reduce((acc, curr) => {
    return acc + curr.totalRequests;
  }, 0);

  const totalSessions = props.stats?.reduce((acc, curr) => {
    return acc + curr.totalSessions;
  }, 0);

  const totalTokens = props.stats?.reduce((acc, curr) => {
    return acc + curr.totalPromptTokens + curr.totalCompletionTokens;
  }, 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={ActivityIcon}
        isPending={props.isPending}
        label="Requests"
        value={totalRequests || 0}
      />
      <StatCard
        icon={MessageSquareIcon}
        isPending={props.isPending}
        label="Sessions"
        value={totalSessions || 0}
      />
      <StatCard
        icon={CoinsIcon}
        isPending={props.isPending}
        label="Tokens"
        value={totalTokens || 0}
      />
    </div>
  );
}

async function AsyncAiSummary(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  range: Range;
}) {
  const { teamId, projectId, authToken, range } = props;
  const aggregatedStatsPromise = getAiUsage(
    {
      from: range.from,
      period: "all",
      projectId,
      teamId,
      to: range.to,
    },
    authToken,
  );

  const aggregatedStats = await aggregatedStatsPromise.catch(() => null);

  return (
    <AiSummaryInner
      stats={aggregatedStats || undefined}
      isPending={false}
    />
  );
}

export function AiSummary(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  range: Range;
}) {
  return (
    <Suspense
      fallback={<AiSummaryInner stats={undefined} isPending={true} />}
    >
      <AsyncAiSummary
        projectId={props.projectId}
        teamId={props.teamId}
        authToken={props.authToken}
        range={props.range}
      />
    </Suspense>
  );
}