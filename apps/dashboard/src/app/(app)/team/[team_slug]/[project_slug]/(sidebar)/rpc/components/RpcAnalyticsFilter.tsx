"use client";

import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";
import { DateRangeSelector } from "@/components/analytics/date-range-selector";
import { IntervalSelector } from "@/components/analytics/interval-selector";
import { getFiltersFromSearchParams, normalizeTimeISOString } from "@/lib/time";

type SearchParams = {
  from?: string;
  to?: string;
  interval?: "day" | "week";
};

export function RpcAnalyticsFilter() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const { range, interval } = getFiltersFromSearchParams({
    defaultRange: "last-30",
    from: responsiveSearchParams.from,
    interval: responsiveSearchParams.interval,
    to: responsiveSearchParams.to,
  });

  return (
    <div className="no-scrollbar flex items-center gap-3 max-sm:overflow-auto">
      <DateRangeSelector
        popoverAlign="end"
        range={range}
        setRange={(newRange) => {
          setResponsiveSearchParams((v: SearchParams) => {
            const newParams = {
              ...v,
              from: normalizeTimeISOString(newRange.from),
              to: normalizeTimeISOString(newRange.to),
            };
            return newParams;
          });
        }}
      />

      <IntervalSelector
        intervalType={interval}
        setIntervalType={(newInterval) => {
          setResponsiveSearchParams((v: SearchParams) => {
            const newParams = {
              ...v,
              interval: newInterval,
            };
            return newParams;
          });
        }}
      />
    </div>
  );
}
