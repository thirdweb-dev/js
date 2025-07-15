"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import { ResponsiveSuspense } from "responsive-rsc";
import type { WebhookConfig } from "@/api/webhook-configs";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
} from "@/types/analytics";
import { DateRangeControls, WebhookPicker } from "./WebhookAnalyticsFilter";

interface WebhookAnalyticsChartsProps {
  webhookConfigs: WebhookConfig[];
  requestsData: WebhookRequestStats[];
  latencyData: WebhookLatencyStats[];
  selectedWebhookId: string;
}

export function WebhookAnalyticsCharts({
  webhookConfigs,
  requestsData,
  latencyData,
  selectedWebhookId,
}: WebhookAnalyticsChartsProps) {
  // Data is already filtered server-side
  const filteredRequestsData = requestsData;
  const filteredLatencyData = latencyData;

  // Process status code distribution data by individual status codes
  const statusCodeData = useMemo(() => {
    if (!filteredRequestsData.length) return [];

    const groupedData = filteredRequestsData.reduce(
      (acc, item) => {
        const date = new Date(item.date).getTime();
        if (!acc[date]) {
          acc[date] = { time: date };
        }

        // Only include valid status codes (not 0) with actual request counts
        if (item.httpStatusCode > 0 && item.totalRequests > 0) {
          const statusKey = item.httpStatusCode.toString();
          acc[date][statusKey] =
            (acc[date][statusKey] || 0) + item.totalRequests;
        }
        return acc;
      },
      {} as Record<string, Record<string, number> & { time: number }>,
    );

    return Object.values(groupedData).sort(
      (a, b) => (a.time || 0) - (b.time || 0),
    );
  }, [filteredRequestsData]);

  // Process latency data for charts
  const latencyChartData = useMemo(() => {
    if (!filteredLatencyData.length) return [];

    return filteredLatencyData
      .map((item) => ({
        p50: item.p50LatencyMs,
        p90: item.p90LatencyMs,
        p99: item.p99LatencyMs,
        time: new Date(item.date).getTime(),
      }))
      .sort((a, b) => a.time - b.time);
  }, [filteredLatencyData]);

  // Chart configurations
  const latencyChartConfig: ChartConfig = {
    p50: {
      color: "hsl(var(--chart-1))",
      label: "P50 Latency",
    },
    p90: {
      color: "hsl(var(--chart-2))",
      label: "P90 Latency",
    },
    p99: {
      color: "hsl(var(--chart-3))",
      label: "P99 Latency",
    },
  };

  // Generate status code chart config dynamically with class-based colors
  const statusCodeConfig: ChartConfig = useMemo(() => {
    const statusCodes = new Set<string>();
    statusCodeData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "time" && !Number.isNaN(Number.parseInt(key))) {
          statusCodes.add(key);
        }
      });
    });

    const getColorForStatusCode = (statusCode: number): string => {
      if (statusCode >= 200 && statusCode < 300) {
        return "hsl(var(--chart-1))"; // Green for 2xx
      } else if (statusCode >= 300 && statusCode < 400) {
        return "hsl(var(--chart-2))"; // Yellow for 3xx
      } else if (statusCode >= 400 && statusCode < 500) {
        return "hsl(var(--chart-3))"; // Orange for 4xx
      } else {
        return "hsl(var(--chart-4))"; // Red for 5xx
      }
    };

    const config: ChartConfig = {};
    Array.from(statusCodes)
      .sort((a, b) => {
        const codeA = Number.parseInt(a);
        const codeB = Number.parseInt(b);
        return codeA - codeB;
      })
      .forEach((statusKey) => {
        const statusCode = Number.parseInt(statusKey);
        config[statusKey] = {
          color: getColorForStatusCode(statusCode),
          label: statusCode.toString(),
        };
      });

    return config;
  }, [statusCodeData]);

  const hasData = statusCodeData.length > 0 || latencyChartData.length > 0;
  const selectedWebhookConfig = webhookConfigs.find(
    (w) => w.id === selectedWebhookId,
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <WebhookPicker
          selectedWebhookId={selectedWebhookId}
          webhookConfigs={webhookConfigs}
        />
        <DateRangeControls />
      </div>

      {/* Selected webhook URL */}
      {selectedWebhookConfig && selectedWebhookId !== "all" && (
        <div className="mb-6">
          <CopyTextButton
            className="font-mono text-sm"
            copyIconPosition="right"
            textToCopy={selectedWebhookConfig.destinationUrl}
            textToShow={selectedWebhookConfig.destinationUrl}
            tooltip="Copy webhook URL"
            variant="outline"
          />
        </div>
      )}

      {!hasData ? (
        <div className="flex items-center justify-center p-8 rounded-xl border border-border bg-card">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              No webhook data available
            </h3>
            <p className="text-sm text-muted-foreground">
              Webhook analytics will appear here once you start receiving
              webhook events.
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveSuspense
          fallback={
            <div className="flex flex-col gap-6">
              <Skeleton className="h-[350px] rounded-xl" />
              <Skeleton className="h-[350px] rounded-xl" />
            </div>
          }
          searchParamsUsed={["from", "to", "interval", "webhook"]}
        >
          <div className="flex flex-col gap-6">
            {/* Status Code Distribution Chart */}
            <ThirdwebBarChart
              chartClassName="aspect-[1.5] lg:aspect-[3]"
              config={statusCodeConfig}
              data={statusCodeData}
              header={{
                description: "Breakdown of responses by status code",
                title: "Response Status Codes",
              }}
              isPending={false}
              showLegend
              toolTipLabelFormatter={(label) =>
                format(
                  new Date(Number.parseInt(label as string)),
                  "MMM dd, yyyy HH:mm",
                )
              }
              toolTipValueFormatter={(value) => `${value} requests`}
              variant="stacked"
            />

            {/* Latency Chart */}
            <ThirdwebAreaChart
              chartClassName="aspect-[1.5] lg:aspect-[3]"
              className="w-full"
              config={latencyChartConfig}
              data={latencyChartData}
              header={{
                description: "Webhook response times in milliseconds",
                title: "Response Latency",
              }}
              isPending={false}
              showLegend
              toolTipLabelFormatter={(label) =>
                format(
                  new Date(Number.parseInt(label as string)),
                  "MMM dd, yyyy HH:mm",
                )
              }
              toolTipValueFormatter={(value) => `${value}ms`}
            />
          </div>
        </ResponsiveSuspense>
      )}
    </div>
  );
}
