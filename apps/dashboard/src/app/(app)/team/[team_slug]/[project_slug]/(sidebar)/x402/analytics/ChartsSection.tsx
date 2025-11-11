"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Metric } from "./MetricSwitcher";
import { MetricSwitcher } from "./MetricSwitcher";

export function ChartMetricSwitcher() {
  const router = useDashboardRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const metric = (searchParams.get("metric") as Metric) || "volume";

  const handleMetricChange = useCallback(
    (newMetric: Metric) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("metric", newMetric);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex justify-end">
      <MetricSwitcher value={metric} onChange={handleMetricChange} />
    </div>
  );
}
