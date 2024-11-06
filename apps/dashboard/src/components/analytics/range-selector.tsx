"use client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useQuery } from "@tanstack/react-query";
import {
  DateRangeSelector,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import type {
  DurationId,
  Range,
} from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import { differenceInDays } from "date-fns";
import { usePathname, useSearchParams } from "next/navigation";

export function RangeSelector({
  range,
  interval,
}: { range?: Range; interval: "day" | "week" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useDashboardRouter();

  const { data: computedRange } = useQuery({
    queryKey: ["analytics-range", searchParams?.toString(), range],
    queryFn: async () => {
      if (range) {
        return range;
      }
      if (searchParams) {
        const fromStringified = searchParams.get("from");
        const from = fromStringified
          ? new Date(fromStringified)
          : getLastNDaysRange("last-120").from;
        const toStringified = searchParams.get("to");
        const to = toStringified ? new Date(toStringified) : new Date();
        const type = (searchParams.get("type") as DurationId) || "last-120";
        return { from, to, type } satisfies Range;
      }
      return getLastNDaysRange("last-120");
    },
  });

  return (
    <div className="flex flex-col justify-end gap-3 sm:flex-row">
      <DateRangeSelector
        range={computedRange || getLastNDaysRange("last-120")}
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
