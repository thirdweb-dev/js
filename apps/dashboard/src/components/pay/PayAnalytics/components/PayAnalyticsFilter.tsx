"use client";

import { normalizeTimeISOString } from "@/lib/time";
import { DateRangeSelector } from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import { getUniversalBridgeFiltersFromSearchParams } from "lib/time";
import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";

export function PayAnalyticsFilter() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const { range, interval } = getUniversalBridgeFiltersFromSearchParams({
    from: responsiveSearchParams.from,
    to: responsiveSearchParams.to,
    interval: responsiveSearchParams.interval,
  });

  return (
    <div className="no-scrollbar flex items-center gap-3 max-sm:overflow-auto">
      <DateRangeSelector
        range={range}
        popoverAlign="end"
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
