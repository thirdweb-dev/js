"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { DateRangeSelector } from "../../../../../../../components/analytics/date-range-selector";
import { ChartUI } from "../_common/ChartUI";
import { type TestData, fetchTestData } from "../_common/fetchTestData";
import { useRange, useSetRange } from "./contexts";

export function QueryChartUI(props: {
  initialData: TestData;
}) {
  const range = useRange();
  const initialRange = useRef(range);
  const chartDataQuery = useQuery({
    queryKey: [
      "fetchTestDate",
      {
        from: range.from.toDateString(),
        to: range.to.toDateString(),
      },
    ],
    queryFn: () => {
      console.log("client side query", range);
      return fetchTestData(range);
    },
    initialData() {
      const hasInitialData =
        range.from.toString() === initialRange.current.from.toString() &&
        range.to.toString() === initialRange.current.to.toString();

      if (hasInitialData) {
        return props.initialData;
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <ChartUI
      data={chartDataQuery.data || []}
      isPending={chartDataQuery.isPending}
    />
  );
}

export function RangeSelector() {
  const range = useRange();
  const setRange = useSetRange();
  return (
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
  );
}
