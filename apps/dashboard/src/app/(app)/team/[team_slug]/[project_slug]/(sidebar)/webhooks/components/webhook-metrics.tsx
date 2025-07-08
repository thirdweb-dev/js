"use client";

import type { WebhookSummaryStats } from "@/types/analytics";

interface WebhookMetricsProps {
  metrics: WebhookSummaryStats | null;
  isPaused: boolean;
}

export function WebhookMetrics({ metrics, isPaused }: WebhookMetricsProps) {
  if (isPaused) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
        Paused
      </span>
    );
  }

  if (!metrics) {
    return (
      <div className="text-sm text-muted-foreground">No metrics available</div>
    );
  }

  const totalRequests = metrics.totalRequests ?? 0;
  const errorRequests = metrics.errorRequests ?? 0;
  const errorRate =
    totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;

  return (
    <div className="text-sm">
      <div className="font-medium">{totalRequests} requests</div>
      <div className="text-xs text-muted-foreground">
        {errorRate.toFixed(1)}% errors
      </div>
    </div>
  );
}
