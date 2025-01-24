"use client";

import { DateRangeSelector } from "../../../../../../../components/analytics/date-range-selector";
import { getRange } from "../_common/getRange";
import {
  useResponsiveSearchParams,
  useSetResponsiveSearchParams,
} from "./responsive";

export function RangeSelector() {
  const responsiveSearchParams = useResponsiveSearchParams();
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const range = getRange({
    from: responsiveSearchParams.from,
    to: responsiveSearchParams.to,
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
