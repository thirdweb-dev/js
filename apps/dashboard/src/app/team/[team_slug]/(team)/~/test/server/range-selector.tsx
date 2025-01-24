"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import { usePathname } from "next/navigation";
import {
  DateRangeSelector,
  type Range,
} from "../../../../../../../components/analytics/date-range-selector";

export function RangeSelector(props: {
  range: Range;
}) {
  const pathname = usePathname();
  const router = useDashboardRouter();

  return (
    <DateRangeSelector
      range={props.range}
      setRange={(newRange) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("from", newRange.from.toDateString());
        searchParams.set("to", newRange.to.toDateString());

        // triggers update
        router.replace(`${pathname}?${searchParams.toString()}`);
      }}
    />
  );
}
