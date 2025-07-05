"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { ResponsiveSuspense } from "responsive-rsc";
import type { WebhookConfig } from "@/api/webhook-configs";
import type { Range } from "@/components/analytics/date-range-selector";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
} from "@/types/analytics";
import { WebhookAnalyticsFilter } from "./WebhookAnalyticsFilter";

interface WebhookAnalyticsChartsProps {
  webhookConfigs: WebhookConfig[];
  requestsData: WebhookRequestStats[];
  latencyData: WebhookLatencyStats[];
  range: Range;
}

export function WebhookAnalyticsCharts({
  webhookConfigs,
  requestsData,
  latencyData,
  range,
}: WebhookAnalyticsChartsProps) {
  const [selectedWebhook, setSelectedWebhook] = useState<string>("all");

  // Filter data based on selected webhook and date range
  const webhookId = selectedWebhook === "all" ? undefined : selectedWebhook;
  const filteredRequestsData = useMemo(() => {
    let data = requestsData;

    // Filter by webhook if specified
    if (webhookId) {
      data = data.filter((item) => item.webhookId === webhookId);
    }

    // Filter by date range
    data = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= range.from && itemDate <= range.to;
    });

    return data;
  }, [requestsData, webhookId, range.from, range.to]);

  const filteredLatencyData = useMemo(() => {
    let data = latencyData;

    // Filter by webhook if specified
    if (webhookId) {
      data = data.filter((item) => item.webhookId === webhookId);
    }

    // Filter by date range
    data = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= range.from && itemDate <= range.to;
    });

    return data;
  }, [latencyData, webhookId, range.from, range.to]);

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
        return "hsl(142, 76%, 36%)"; // Green for 2xx
      } else if (statusCode >= 300 && statusCode < 400) {
        return "hsl(48, 96%, 53%)"; // Yellow for 3xx
      } else if (statusCode >= 400 && statusCode < 500) {
        return "hsl(25, 95%, 53%)"; // Orange for 4xx
      } else {
        return "hsl(0, 84%, 60%)"; // Red for 5xx
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

  const selectedWebhookConfig = webhookConfigs.find(
    (w) => w.id === selectedWebhook,
  );

  // Show empty state if no data
  if (statusCodeData.length === 0 && latencyChartData.length === 0) {
    return (
      <div>
        <div className="mb-4 flex justify-start">
          <WebhookAnalyticsFilter />
        </div>
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
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-start">
        <WebhookAnalyticsFilter />
      </div>
      <ResponsiveSuspense
        fallback={
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-80 mt-2" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-64" />
              </div>
            </div>
            <Skeleton className="h-[350px] rounded-xl" />
            <Skeleton className="h-[350px] rounded-xl" />
            <Skeleton className="h-[350px] rounded-xl" />
          </div>
        }
        searchParamsUsed={["from", "to", "interval", "webhook"]}
      >
        <div className="space-y-6">
          {/* Header with webhook selector */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Webhook Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Performance metrics and trends for your webhooks
              </p>
            </div>

            <div className="flex gap-3">
              <Select
                onValueChange={setSelectedWebhook}
                value={selectedWebhook}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Webhooks</SelectItem>
                  {webhookConfigs.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      <div className="flex items-center gap-2">
                        <span>{config.description || "Unnamed webhook"}</span>
                        {config.pausedAt && (
                          <Badge className="text-xs" variant="secondary">
                            Paused
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected webhook info */}
          {selectedWebhookConfig && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {selectedWebhookConfig.description || "Unnamed Webhook"}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedWebhookConfig.destinationUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        selectedWebhookConfig.pausedAt ? "secondary" : "default"
                      }
                    >
                      {selectedWebhookConfig.pausedAt ? "Paused" : "Active"}
                    </Badge>
                    {selectedWebhookConfig.topics.slice(0, 2).map((topic) => (
                      <Badge key={topic.id} variant="outline">
                        {topic.serviceName}
                      </Badge>
                    ))}
                    {selectedWebhookConfig.topics.length > 2 && (
                      <Badge variant="outline">
                        +{selectedWebhookConfig.topics.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts */}
          <div className="flex flex-col gap-6">
            {/* Status Code Distribution Chart */}
            <ThirdwebBarChart
              chartClassName="h-[220px] w-full aspect-auto"
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
              chartClassName="h-[220px] w-full aspect-auto"
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
        </div>
      </ResponsiveSuspense>
    </div>
  );
}
