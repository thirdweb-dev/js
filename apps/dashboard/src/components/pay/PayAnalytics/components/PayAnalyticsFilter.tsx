"use client";

import { normalizeTimeISOString } from "@/lib/time";
import { useQuery } from "@tanstack/react-query";
import {
  DateRangeSelector,
  type DurationId,
} from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import { getUniversalBridgeFiltersFromSearchParams } from "lib/time";
import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";

const STORAGE_KEY = "thirdweb:ub-analytics-range";

type SavedRange = {
  rangeType: string;
  interval: "day" | "week";
};

type SearchParams = {
  from?: string;
  to?: string;
  interval?: "day" | "week";
};

export function PayAnalyticsFilter() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  // Load saved range from localStorage using useQuery
  useQuery<SavedRange | null>({
    queryKey: [
      "savedRange",
      responsiveSearchParams.from,
      responsiveSearchParams.to,
    ],
    queryFn: () => {
      const savedRangeString = localStorage.getItem(STORAGE_KEY);
      if (savedRangeString) {
        try {
          const savedRange = JSON.parse(savedRangeString) as SavedRange;
          // Get the current range based on the saved range type
          const { range } = getUniversalBridgeFiltersFromSearchParams({
            from: undefined,
            to: undefined,
            interval: savedRange.interval,
            defaultRange: (savedRange.rangeType || "last-30") as DurationId,
          });

          setResponsiveSearchParams((v) => ({
            ...v,
            from: normalizeTimeISOString(range.from),
            to: normalizeTimeISOString(range.to),
            interval: savedRange.interval,
          }));
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY);
          console.error("Failed to parse saved range:", e);
        }
      }
      return null;
    },
    enabled: !responsiveSearchParams.from && !responsiveSearchParams.to,
  });

  const { range, interval } = getUniversalBridgeFiltersFromSearchParams({
    from: responsiveSearchParams.from,
    to: responsiveSearchParams.to,
    interval: responsiveSearchParams.interval,
    defaultRange: "last-30",
  });

  const saveToLocalStorage = (params: {
    rangeType: string;
    interval: "day" | "week";
  }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  };

  return (
    <div className="no-scrollbar flex items-center gap-3 max-sm:overflow-auto">
      <DateRangeSelector
        range={range}
        popoverAlign="end"
        setRange={(newRange) => {
          setResponsiveSearchParams((v: SearchParams) => {
            const newParams = {
              ...v,
              from: normalizeTimeISOString(newRange.from),
              to: normalizeTimeISOString(newRange.to),
            };
            // Save to localStorage
            saveToLocalStorage({
              rangeType: newRange.type || "last-30",
              interval: newParams.interval || "day",
            });
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
            // Save to localStorage
            saveToLocalStorage({
              rangeType: range.type || "last-30",
              interval: newInterval,
            });
            return newParams;
          });
        }}
      />
    </div>
  );
}
