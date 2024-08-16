"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { TimeRange } from "lib/search";
import { usePathname, useSearchParams } from "next/navigation";

export function TimeRangeSwitcher() {
  const router = useDashboardRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams?.get("sortBy") || "transactionCount";
  return (
    <ToggleGroup
      type="single"
      value={searchParams?.get("timeRange") || "day"}
      onValueChange={async (value: TimeRange) => {
        router.replace(
          `${path}?timeRange=${value}${currentSort ? `&sortBy=${currentSort}` : ""}`,
          {
            scroll: false,
          },
        );
      }}
    >
      <ToggleGroupItem value="day">Last 24h</ToggleGroupItem>
      <ToggleGroupItem value="week">Last 7 Days</ToggleGroupItem>
      <ToggleGroupItem value="month">Last 30 Days</ToggleGroupItem>
    </ToggleGroup>
  );
}
