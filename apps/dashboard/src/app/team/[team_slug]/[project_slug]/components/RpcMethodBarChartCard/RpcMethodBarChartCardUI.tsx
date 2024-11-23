"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatTickerNumber } from "lib/format-utils";
import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";
import type { RpcMethodStats } from "types/analytics";
import { EmptyStateCard } from "../../../../components/Analytics/EmptyStateCard";

export function RpcMethodBarChartCardUI({
  rawData,
}: { rawData: RpcMethodStats[] }) {
  const uniqueMethods = useMemo(
    () => Array.from(new Set(rawData.map((d) => d.evmMethod))),
    [rawData],
  );
  const uniqueDates = useMemo(
    () => Array.from(new Set(rawData.map((d) => d.date))),
    [rawData],
  );

  const data = useMemo(() => {
    return uniqueDates.map((date) => {
      const dateData: { [key: string]: string | number } = { date };
      for (const method of uniqueMethods) {
        const methodData = rawData.find(
          (d) => d.date === date && d.evmMethod === method,
        );
        dateData[method] = methodData?.count ?? 0;
      }

      // If we have too many methods to display well, add "other" and group the lowest keys for each time period
      if (uniqueMethods.length > 5) {
        // If we haven't added "other" as a key yet, add it
        if (!uniqueMethods.includes("Other")) {
          uniqueMethods.push("Other");
        }

        // Sort the methods by their count for the time period
        const sortedMethods = uniqueMethods
          .filter((m) => m !== "Other")
          .sort(
            (a, b) =>
              ((dateData[b] as number) ?? 0) - ((dateData[a] as number) ?? 0),
          );

        dateData.Other = 0;
        for (const method of sortedMethods.slice(5, sortedMethods.length)) {
          dateData.Other += (dateData[method] as number) ?? 0;
          delete dateData[method];
        }
      }
      return dateData;
    });
  }, [uniqueDates, uniqueMethods, rawData]);

  const config: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const method of uniqueMethods) {
      config[method] = {
        label: method,
      };
    }
    return config;
  }, [uniqueMethods]);

  if (
    data.length === 0 ||
    data.every((date) =>
      Object.keys(date).every((k) => k === "date" || date[k] === 0),
    )
  ) {
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
          config={config}
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
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => formatTickerNumber(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  valueFormatter={(v: unknown) =>
                    formatTickerNumber(v as number)
                  }
                />
              }
            />
            {uniqueMethods.map((method, idx) => (
              <Bar
                key={method}
                stackId="a"
                dataKey={method}
                radius={[
                  idx === uniqueMethods.length - 1 ? 4 : 0,
                  idx === uniqueMethods.length - 1 ? 4 : 0,
                  idx === 0 ? 4 : 0,
                  idx === 0 ? 4 : 0,
                ]}
                fill={`hsl(var(--chart-${idx + 1}))`}
              />
            ))}
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
