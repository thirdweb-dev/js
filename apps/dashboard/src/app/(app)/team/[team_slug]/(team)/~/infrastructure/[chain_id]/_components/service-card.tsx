"use client";

import { EmptyChartState } from "@/components/analytics/empty-chart-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner/Spinner";

type ServiceStatus = "active" | "pending" | "inactive";

type InfraServiceCardProps = {
  title: string;
  status: ServiceStatus;
};

export function InfraServiceCard({ title, status }: InfraServiceCardProps) {
  return (
    <section className="flex flex-col gap-3">
      {/* Header row with status and optional action */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
          <Badge
            className="gap-2"
            variant={
              status === "active"
                ? "success"
                : status === "pending"
                  ? "default"
                  : "outline"
            }
          >
            {status === "active"
              ? "Active"
              : status === "pending"
                ? "Pending"
                : "Inactive"}
            {status === "pending" && <Spinner className="size-3" />}
          </Badge>
        </div>
      </div>

      <MetricPlaceholders serviceTitle={title} status={status} />
    </section>
  );
}

// --- Helper Components ---

function MetricPlaceholders({
  status,
  serviceTitle,
}: {
  status: ServiceStatus;
  serviceTitle: string;
}) {
  const metrics = getMetricsForService(serviceTitle);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {metrics.map((metric) => (
        <Card className="p-4 flex flex-col gap-2" key={metric.key}>
          <span className="text-xs font-medium text-muted-foreground">
            {metric.label}
          </span>
          <div className="h-32 w-full">
            <EmptyChartState type="area">
              {status === "active" ? (
                <Badge>Coming Soon</Badge>
              ) : status === "pending" ? (
                <p className="text-xs">Activation in progress.</p>
              ) : (
                <p className="text-xs">Activate service to view metrics.</p>
              )}
            </EmptyChartState>
          </div>
        </Card>
      ))}
    </div>
  );
}

type Metric = { key: string; label: string };

function getMetricsForService(title: string): Metric[] {
  const normalized = title.toLowerCase();

  if (normalized === "rpc") {
    return [
      { key: "requests", label: "Requests" },
      { key: "monthly_active_developers", label: "Monthly Active Developers" },
    ];
  }

  if (normalized === "insight") {
    return [
      { key: "requests", label: "Requests" },
      { key: "monthly_active_developers", label: "Monthly Active Developers" },
    ];
  }

  if (normalized === "account abstraction") {
    return [
      { key: "transactions", label: "Transactions" },
      { key: "monthly_active_developers", label: "Monthly Active Developers" },
      { key: "gas_sponsored", label: "Gas Sponsored" },
    ];
  }

  // fallback empty
  return [];
}
