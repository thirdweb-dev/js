"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useWebhookMetrics } from "../hooks/use-webhook-metrics";

interface WebhookMetricsProps {
  webhookId: string;
  teamId: string;
  projectId: string;
  isPaused: boolean;
}

export function WebhookMetrics({
  webhookId,
  teamId,
  projectId,
  isPaused,
}: WebhookMetricsProps) {
  const {
    data: metrics,
    isLoading,
    error,
  } = useWebhookMetrics({
    projectId,
    teamId,
    webhookId,
  });

  if (isPaused) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
        Paused
      </span>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-muted-foreground">
        Failed to load metrics
      </div>
    );
  }

  const totalRequests = metrics?.totalRequests ?? 0;
  const errorRequests = metrics?.errorRequests ?? 0;
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
