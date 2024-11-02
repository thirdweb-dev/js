"use client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { DateRangeSelector } from "components/analytics/date-range-selector";
import type { Range } from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import { differenceInDays } from "date-fns";
import { usePathname, useSearchParams } from "next/navigation";

export function RangeSelector({
  range,
  interval,
}: { range: Range; interval: "day" | "week" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useDashboardRouter();

  return (
    <div className="flex justify-end gap-3">
      <DateRangeSelector
        range={range}
        setRange={(newRange) => {
          const days = differenceInDays(newRange.to, newRange.from);
          const interval = days > 30 ? "week" : "day";
          const newSearchParams = new URLSearchParams(searchParams || {});
          newSearchParams.set("from", newRange.from.toISOString());
          newSearchParams.set("to", newRange.to.toISOString());
          newSearchParams.set("type", newRange.type);
          newSearchParams.set("interval", interval);
          router.push(`${pathname}?${newSearchParams.toString()}`);
        }}
      />
      <IntervalSelector
        intervalType={interval}
        setIntervalType={(newInterval) => {
          const newSearchParams = new URLSearchParams(searchParams || {});
          newSearchParams.set("interval", newInterval);
          router.push(`${pathname}?${newSearchParams.toString()}`);
        }}
      />
    </div>
  );
}
