"use client";

import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "responsive-rsc";
import { DateRangeSelector } from "../../../../../../../components/analytics/date-range-selector";
import { getRange } from "../_common/getRange";

export function RangeSelector() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const range = getRange({
    from:
      typeof responsiveSearchParams.from === "string"
        ? responsiveSearchParams.from
        : undefined,
    to:
      typeof responsiveSearchParams.to === "string"
        ? responsiveSearchParams.to
        : undefined,
  });

  return (
    <DateRangeSelector
      range={range}
      setRange={(newRange) => {
        setResponsiveSearchParams((v) => {
          return {
            ...v,
            from: newRange.from.toDateString(),
            to: newRange.to.toDateString(),
          };
        });
      }}
    />
  );
}
