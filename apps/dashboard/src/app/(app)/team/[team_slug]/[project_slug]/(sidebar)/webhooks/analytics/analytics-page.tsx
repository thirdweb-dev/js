import { subHours } from "date-fns";
import { AlertTriangleIcon, ClockIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getWebhookLatency,
  getWebhookRequests,
  getWebhookSummary,
} from "@/api/analytics";
import type { Project } from "@/api/projects";
import { getWebhookConfigs, type WebhookConfig } from "@/api/webhooks";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { RangeSelector } from "@/components/analytics/range-selector";
import { StatCard } from "@/components/analytics/stat";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
  WebhookSummaryStats,
} from "@/types/analytics";
import { LatencyChart } from "./latency-chart";
import { StatusCodesChart } from "./status-codes-chart";
import { WebhookSelector } from "./webhook-selector";

type WebhookAnalyticsProps = {
  interval: "day" | "week";
  range: Range;
  selectedWebhookId: string | null;
  webhooksConfigs: WebhookConfig[];
  requestStats: WebhookRequestStats[];
  latencyStats: WebhookLatencyStats[];
  summaryStats: WebhookSummaryStats[];
};

function WebhookAnalytics({
  interval,
  range,
  selectedWebhookId,
  webhooksConfigs,
  requestStats,
  latencyStats,
  summaryStats,
}: WebhookAnalyticsProps) {
  // Calculate overview metrics for the last 24 hours
  const errorRate = 100 - (summaryStats[0]?.successRate || 0);
  const avgLatency = summaryStats[0]?.avgLatencyMs || 0;

  // Transform request data for combined chart.
  const allRequestsData = requestStats
    .reduce((acc, stat) => {
      const statusCode = stat.httpStatusCode.toString();
      const existingEntry = acc.find((entry) => entry.time === stat.date);
      if (existingEntry) {
        existingEntry[statusCode] =
          (existingEntry[statusCode] || 0) + stat.totalRequests;
      } else {
        acc.push({
          time: stat.date,
          [statusCode]: stat.totalRequests,
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // Transform latency data for line chart.
  const latencyData = latencyStats
    .map((stat) => ({ ...stat, time: stat.date }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <div className="flex flex-col gap-6">
      <WebhookSelector
        selectedWebhookId={selectedWebhookId}
        webhooks={webhooksConfigs}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          formatter={(value) => `${value.toFixed(2)}%`}
          icon={AlertTriangleIcon}
          isPending={false}
          label="Error Rate (24h)"
          value={errorRate}
        />
        <StatCard
          formatter={(value) => `${value.toFixed(0)}ms`}
          icon={ClockIcon}
          isPending={false}
          label="P50 Latency (24h)"
          value={avgLatency}
        />
      </div>

      <RangeSelector interval={interval} range={range} />

      <div className="flex flex-col gap-4 lg:gap-6">
        <StatusCodesChart data={allRequestsData} isPending={false} />
        <LatencyChart data={latencyData} isPending={false} />
      </div>
    </div>
  );
}

const DEFAULT_RANGE = getLastNDaysRange("last-120");
const DEFAULT_INTERVAL = "week" as const;

export async function AnalyticsPageContent({
  teamSlug,
  project,
  searchParams,
}: {
  teamSlug: string;
  project: Project;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Parse search params for filters
  const selectedWebhookId = searchParams?.webhookId as string | undefined;
  const interval =
    (searchParams?.interval as "day" | "week") || DEFAULT_INTERVAL;
  const range = DEFAULT_RANGE; // Could be enhanced to parse from search params

  // Get webhook configs.
  const webhooksConfigsResponse = await getWebhookConfigs(teamSlug, project.id);
  if ("error" in webhooksConfigsResponse) {
    toast.error(webhooksConfigsResponse.error);
    return null;
  }

  // Get webhook analytics.
  const [requestStats, latencyStats, summaryStats] = await Promise.all([
    getWebhookRequests({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      period: interval,
      to: range.to,
      webhookId: selectedWebhookId || undefined,
    }).catch(() => []),
    getWebhookLatency({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      period: interval,
      to: range.to,
      webhookId: selectedWebhookId || undefined,
    }).catch(() => []),
    getWebhookSummary({
      teamId: project.teamId,
      projectId: project.id,
      from: subHours(new Date(), 24),
      to: new Date(),
      webhookId: selectedWebhookId || undefined,
    }).catch(() => []),
  ]);

  return (
    <WebhookAnalytics
      interval={interval}
      latencyStats={latencyStats}
      range={range}
      requestStats={requestStats}
      selectedWebhookId={selectedWebhookId || null}
      summaryStats={summaryStats}
      webhooksConfigs={webhooksConfigsResponse.data}
    />
  );
}
