"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  DateRangeSelector,
  type Range,
} from "../../../../../../../components/analytics/date-range-selector";
import { ChartUI } from "../_common/ChartUI";
import { fetchTestData } from "../_common/fetchTestData";

export function ClientPage(props: {
  range: Range;
}) {
  const [range, setRange] = useState<Range>(props.range);
  const chartDataQuery = useQuery({
    queryKey: [
      "fetchTestDate",
      {
        from: range.from.toDateString(),
        to: range.to.toDateString(),
      },
    ],
    queryFn: () => fetchTestData(range),
    staleTime: 3600 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <DateRangeSelector
        range={range}
        setRange={(v) => {
          setRange(v);
          // update search params without reloading the page
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("from", v.from.toDateString());
          searchParams.set("to", v.to.toDateString());
          window.history.pushState({}, "", `?${searchParams.toString()}`);
        }}
      />
      <div className="h-8" />
      <ChartUI
        data={chartDataQuery.data || []}
        isPending={chartDataQuery.isPending}
      />
    </div>
  );
}
