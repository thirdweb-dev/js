"use client";

import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";
import { DateRangeSelector } from "@/components/analytics/date-range-selector";
import { IntervalSelector } from "@/components/analytics/interval-selector";
import { normalizeTimeISOString } from "@/lib/time";
import { getTxAnalyticsFiltersFromSearchParams } from "../lib/utils";

export function TransactionAnalyticsFilter() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const { range, interval } = getTxAnalyticsFiltersFromSearchParams({
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
          setResponsiveSearchParams((v) => {
            return {
              ...v,
              from: normalizeTimeISOString(newRange.from),
              to: normalizeTimeISOString(newRange.to),
            };
          });
        }}
      />

      <IntervalSelector
        intervalType={interval}
        setIntervalType={(newInterval) => {
          setResponsiveSearchParams((v) => {
            return {
              ...v,
              interval: newInterval,
            };
          });
        }}
      />
    </div>
  );
}
