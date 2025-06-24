import { subHours } from "date-fns";
import { AlertTriangleIcon, ClockIcon } from "lucide-react";
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
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { Card, CardContent } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
  WebhookSummaryStats,
} from "@/types/analytics";
import { LatencyChart } from "./latency-chart";
import { StatusCodesChart } from "./status-codes-chart";
import { WebhookSelector } from "./webhook-selector";
import { toast } from "sonner";
import { StatCard } from "@/components/analytics/stat";



type WebhookAnalyticsProps = {
  interval: "day" | "week";
  range: Range;
  selectedWebhookId: string | null;
  webhooks: WebhookConfig[];
  requestStats: WebhookRequestStats[];
  latencyStats: WebhookLatencyStats[];
  summaryStats: WebhookSummaryStats[];
};

function WebhookAnalytics({
  interval,
  range,
  selectedWebhookId,
  webhooks,
  requestStats,
  latencyStats,
  summaryStats,
}: WebhookAnalyticsProps) {

  // Calculate overview metrics for the last 24 hours
  const last24HoursSummary = summaryStats.find(
    (s) => s.webhookId === selectedWebhookId,
  );
  const errorRate = 100 - (last24HoursSummary?.successRate || 0);
  const avgLatency = last24HoursSummary?.avgLatencyMs || 0;

  // Transform request data for combined chart
  const allRequestsData = requestStats
    .filter(
      (stat) => !selectedWebhookId || stat.webhookId === selectedWebhookId,
    )
    .reduce((acc, stat) => {
      const existingEntry = acc.find((entry) => entry.time === stat.date);
      if (existingEntry) {
        existingEntry.totalRequests += stat.totalRequests;
        existingEntry[stat.httpStatusCode.toString()] =
          (existingEntry[stat.httpStatusCode.toString()] || 0) +
          stat.totalRequests;
      } else {
        acc.push({
          time: stat.date, // Changed from 'date' to 'time'
          totalRequests: stat.totalRequests,
          [stat.httpStatusCode.toString()]: stat.totalRequests,
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // Transform latency data for line chart
  const latencyData = latencyStats
    .filter(
      (stat) => !selectedWebhookId || stat.webhookId === selectedWebhookId,
    )
    .map((stat) => ({
      p50LatencyMs: stat.p50LatencyMs, // Changed from 'date' to 'time'
      p90LatencyMs: stat.p90LatencyMs,
      p99LatencyMs: stat.p99LatencyMs,
      time: stat.date,
    }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <div className="flex flex-col gap-6">
      {/* Webhook Selector */}
      <WebhookSelector
        selectedWebhookId={selectedWebhookId}
        webhooks={webhooks}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={AlertTriangleIcon}
          isPending={false}
          label="Error Rate (24h)"
          value={errorRate}
          formatter={(value) => `${value.toFixed(2)}%`}
        />
         <StatCard
          icon={ClockIcon}
          isPending={false}
          label="P50 Latency (24h)"
          value={avgLatency}
          formatter={(value) => `${value.toFixed(0)}ms`}
        />
      </div>

      <RangeSelector interval={interval} range={range} />

      <div className="flex flex-col gap-4 lg:gap-6">
        {selectedWebhookId && (
          <StatusCodesChart data={allRequestsData} isPending={false} />
        )}

        {selectedWebhookId && (
          <LatencyChart data={latencyData} isPending={false} />
        )}
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
  const interval = (searchParams?.interval as "day" | "week") || DEFAULT_INTERVAL;
  const range = DEFAULT_RANGE; // Could be enhanced to parse from search params

  // Fetch webhooks
  const webhooksResponse = await getWebhookConfigs(teamSlug, project.id);
  if ("error" in webhooksResponse) {
    toast.error(webhooksResponse.error);
    return null;
  }

  const webhooks: WebhookConfig[] =
    webhooksResponse.data.length > 0
      ? webhooksResponse.data
      : [
          {
            id: "8582b449-551e-429f-99c4-5359f253dce1",
            description: "Webhook 2",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            teamId: 'team_clmb33q9w00gn1x0u2ri8z0k0',
            projectId: 'prj_cm6ibyah500bgxag5q7d79fps',
            destinationUrl: "https://example.com/webhook2",
            pausedAt: null,
            webhookSecret: "secret",
          },
        ];

  // Fetch analytics data
  const [requestStats, latencyStats, summaryStats] = await Promise.all([
    getWebhookRequests({
      teamId: 'team_clmb33q9w00gn1x0u2ri8z0k0',
      projectId: 'prj_cm6ibyah500bgxag5q7d79fps',
      // teamId: project.teamId,
      // projectId: project.id,
      from: range.from,
      to: range.to,
      period: interval,
      webhookId: selectedWebhookId || undefined,
    }).catch(() => []),
    getWebhookLatency({
      teamId: 'team_clmb33q9w00gn1x0u2ri8z0k0',
      projectId: 'prj_cm6ibyah500bgxag5q7d79fps',
      // teamId: project.teamId,
      // projectId: project.id,
      from: range.from,
      to: range.to,
      period: interval,
      webhookId: selectedWebhookId || undefined,
    }).catch(() => []),
    getWebhookSummary({
      teamId: 'team_clmb33q9w00gn1x0u2ri8z0k0',
      projectId: 'prj_cm6ibyah500bgxag5q7d79fps',
      // teamId: project.teamId,
      // projectId: project.id,
      from: subHours(new Date(), 24),
      to: new Date(),
      webhookId: selectedWebhookId || undefined,
    }).catch(() => []),
  ]);

  console.log("requestStats", requestStats);
  console.log("latencyStats", latencyStats);
  console.log("summaryStats", summaryStats);

  return (
    <WebhookAnalytics
      interval={interval}
      range={range}
      selectedWebhookId={selectedWebhookId || null}
      webhooks={webhooks}
      requestStats={requestStats}
      latencyStats={latencyStats}
      summaryStats={summaryStats}
    />
  );
}
