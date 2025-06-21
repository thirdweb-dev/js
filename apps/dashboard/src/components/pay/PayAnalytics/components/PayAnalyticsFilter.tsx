"use client";

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
import { normalizeTimeISOString } from "@/lib/time";

const STORAGE_KEY = "thirdweb:ub-analytics-range";

type SavedRange = {
  rangeType: "custom" | DurationId | undefined;
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
    enabled: !responsiveSearchParams.from && !responsiveSearchParams.to,
    queryFn: () => {
      const savedRangeString = localStorage.getItem(STORAGE_KEY);
      if (savedRangeString) {
        try {
          const savedRange = JSON.parse(savedRangeString) as SavedRange;
          // Get the current range based on the saved range type
          const { range } = getUniversalBridgeFiltersFromSearchParams({
            defaultRange:
              savedRange.rangeType === "custom"
                ? "last-30"
                : savedRange.rangeType || "last-30",
            from: undefined,
            interval: savedRange.interval,
            to: undefined,
          });

          setResponsiveSearchParams((v) => ({
            ...v,
            from: normalizeTimeISOString(range.from),
            interval: savedRange.interval,
            to: normalizeTimeISOString(range.to),
          }));
        } catch (e) {
          console.error("Failed to parse saved range:", e);
        }
      }
      return null;
    },
    queryKey: [
      "savedRange",
      responsiveSearchParams.from,
      responsiveSearchParams.to,
    ],
  });

  const { range, interval } = getUniversalBridgeFiltersFromSearchParams({
    defaultRange: "last-30",
    from: responsiveSearchParams.from,
    interval: responsiveSearchParams.interval,
    to: responsiveSearchParams.to,
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
        popoverAlign="end"
        range={range}
        setRange={(newRange) => {
          setResponsiveSearchParams((v: SearchParams) => {
            const newParams = {
              ...v,
              from: normalizeTimeISOString(newRange.from),
              to: normalizeTimeISOString(newRange.to),
            };
            // Save to localStorage
            saveToLocalStorage({
              interval: newParams.interval || "day",
              rangeType: newRange.type || "last-30",
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
              interval: newInterval,
              rangeType: range.type || "last-30",
            });
            return newParams;
          });
        }}
      />
    </div>
  );
}
