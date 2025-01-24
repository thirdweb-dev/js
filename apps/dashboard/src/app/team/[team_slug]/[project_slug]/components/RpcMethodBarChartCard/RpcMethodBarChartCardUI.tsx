"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
} from "recharts";
import type { RpcMethodStats } from "types/analytics";
import { EmptyStateCard } from "../../../../components/Analytics/EmptyStateCard";

export function RpcMethodBarChartCardUI({
  rawData,
}: { rawData: RpcMethodStats[] }) {
  const maxMethodsToDisplay = 10;

  const { data, methodsToDisplay, chartConfig, isAllEmpty } = useMemo(() => {
    const dateToValueMap: Map<string, Record<string, number>> = new Map();
    const methodNameToCountMap: Map<string, number> = new Map();

    for (const dataItem of rawData) {
      const { date, evmMethod, count } = dataItem;
      let dateRecord = dateToValueMap.get(date);

      if (!dateRecord) {
        dateRecord = {};
        dateToValueMap.set(date, dateRecord);
      }

      dateRecord[evmMethod] = (dateRecord[evmMethod] || 0) + count;
      methodNameToCountMap.set(
        evmMethod,
        (methodNameToCountMap.get(evmMethod) || 0) + count,
      );
    }

    // sort methods by count (highest count first) - remove the ones with 0 count
    const sortedMethodsByCount = Array.from(methodNameToCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .filter((x) => x[1] > 0);

    const methodsToDisplayArray = sortedMethodsByCount
      .slice(0, maxMethodsToDisplay)
      .map(([method]) => method);
    const methodsToDisplay = new Set(methodsToDisplayArray);

    // loop over each entry in dateToValueMap
    // replace the method that is not in methodsToDisplay with "Other"
    // add total key that is the sum of all methods
    for (const dateRecord of dateToValueMap.values()) {
      // calculate total
      let totalCountOfDay = 0;
      for (const count of Object.values(dateRecord)) {
        totalCountOfDay += count;
      }

      for (const method of Object.keys(dateRecord)) {
        if (!methodsToDisplay.has(method)) {
          dateRecord.Other =
            (dateRecord.Other || 0) + (dateRecord[method] || 0);
          delete dateRecord[method];
        }
      }

      dateRecord.total = totalCountOfDay;
    }

    const returnValue: Array<Record<string, string | number>> = [];
    for (const [date, value] of dateToValueMap.entries()) {
      returnValue.push({ date, ...value });
    }

    const chartConfig: ChartConfig = {};
    for (const method of methodsToDisplayArray) {
      chartConfig[method] = {
        label: method,
      };
    }

    // if we need to display "Other" methods
    if (sortedMethodsByCount.length > maxMethodsToDisplay) {
      chartConfig.Other = {
        label: "Other",
      };
      methodsToDisplayArray.push("Other");
    }

    return {
      data: returnValue,
      methodsToDisplay: methodsToDisplayArray,
      chartConfig,
      isAllEmpty: returnValue.every((d) => d.total === 0),
    };
  }, [rawData]);

  if (data.length === 0 || isAllEmpty) {
    return <EmptyStateCard metric="RPC" link="https://portal.thirdweb.com/" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 p-6">
          <CardTitle className="font-semibold text-lg">RPC Methods</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 sm:pl-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full pt-6"
        >
          <RechartsBarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(d) => formatDate(new Date(d), "MMM d")}
                  valueFormatter={(_value, _item) => {
                    const value = typeof _value === "number" ? _value : 0;
                    const payload = _item as {
                      payload: {
                        total: number;
                      };
                    };
                    const total =
                      payload.payload.total === 0 ? 1 : payload.payload.total;
                    return (
                      <span className="inline-flex gap-1.5">
                        {`${((value / total) * 100).toFixed(2)}`}
                        <span className="text-muted-foreground">%</span>
                      </span>
                    );
                  }}
                />
              }
            />
            {methodsToDisplay.map((method, idx) => (
              <Bar
                key={method}
                stackId="a"
                dataKey={method}
                radius={[
                  idx === methodsToDisplay.length - 1 ? 4 : 0,
                  idx === methodsToDisplay.length - 1 ? 4 : 0,
                  idx === 0 ? 4 : 0,
                  idx === 0 ? 4 : 0,
                ]}
                fill={`hsl(var(--chart-${idx + 1}))`}
                strokeWidth={1}
                className="stroke-background"
              />
            ))}
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
