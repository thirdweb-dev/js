"use client";

import { DateRangeSelector } from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import {
  getNebulaFiltersFromSearchParams,
  normalizeTimeISOString,
} from "lib/time";
import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";

export function NebulaAnalyticsFilter() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const { range, interval } = getNebulaFiltersFromSearchParams({
    from: responsiveSearchParams.from,
    to: responsiveSearchParams.to,
    interval: responsiveSearchParams.interval,
  });

  return (
    <div className="no-scrollbar flex items-center gap-3 overflow-auto">
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
