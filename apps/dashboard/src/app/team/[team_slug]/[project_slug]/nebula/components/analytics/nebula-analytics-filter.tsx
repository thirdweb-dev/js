"use client";

import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";
import { DateRangeSelector } from "../../../../../../../components/analytics/date-range-selector";
import { IntervalSelector } from "../../../../../../../components/analytics/interval-selector";
import {
  getNebulaFiltersFromSearchParams,
  normalizeTimeISOString,
} from "../../../../../../../lib/time";

export function NebulaAnalyticsFilter() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const { range, interval } = getNebulaFiltersFromSearchParams({
    from: responsiveSearchParams.from,
    to: responsiveSearchParams.to,
    interval: responsiveSearchParams.interval,
  });

  return (
    <div className="flex items-center gap-3">
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
