"use client";

import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";
import {
  DateRangeSelector,
  type DurationId,
} from "@/components/analytics/date-range-selector";
import { IntervalSelector } from "@/components/analytics/interval-selector";
import { getFiltersFromSearchParams, normalizeTimeISOString } from "@/lib/time";

export function ResponsiveTimeFilters(props: { defaultRange: DurationId }) {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange: props.defaultRange,
    from: responsiveSearchParams.from,
    interval: responsiveSearchParams.interval,
    to: responsiveSearchParams.to,
  });

  return (
    <div className="flex justify-end gap-3 flex-col lg:flex-row">
      <DateRangeSelector
        className="rounded-full"
        range={range}
        setRange={(newRange) => {
          setResponsiveSearchParams((v) => {
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
        className="bg-card rounded-full"
        intervalType={interval}
        setIntervalType={(newInterval) => {
          setResponsiveSearchParams((v) => {
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
