"use client";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { EngineCloudStats } from "@/types/analytics";
import { EmptyStateCard } from "../../../../../components/Analytics/EmptyStateCard";

export function EngineCloudBarChartCardUI({
  rawData,
}: {
  rawData: EngineCloudStats[];
}) {
  const { data, pathnames, chartConfig, isAllEmpty } = useMemo(() => {
    // Dynamically collect all unique pathnames
    const pathnameSet = new Set<string>();
    for (const item of rawData) {
      // Ignore empty pathname ''.
      if (item.pathname) {
        pathnameSet.add(item.pathname);
      }
    }
    const pathnames = Array.from(pathnameSet);

    // Group by date, then by pathname
    const dateMap = new Map<string, Record<string, number>>();
    for (const { date, pathname, totalRequests } of rawData) {
      const map = dateMap.get(date) ?? {};
      map[pathname] = Number(totalRequests) || 0;
      dateMap.set(date, map);
    }

    // Build data array for recharts
    const data = Array.from(dateMap.entries()).map(([date, value]) => {
      let total = 0;
      for (const pathname of pathnames) {
        if (!value[pathname]) value[pathname] = 0;
        total += value[pathname];
      }
      return { date, ...value, total };
    });

    // Chart config
    const chartConfig: ChartConfig = {};
    for (const pathname of pathnames) {
      chartConfig[pathname] = { label: pathname };
    }

    return {
      chartConfig,
      data,
      isAllEmpty: data.every((d) => d.total === 0),
      pathnames,
    };
  }, [rawData]);

  if (data.length === 0 || isAllEmpty) {
    return <EmptyStateCard link="https://portal.thirdweb.com/" metric="RPC" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 p-6">
          <CardTitle className="font-semibold text-lg">
            Engine Cloud Requests
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 sm:pl-0">
        <ChartContainer
          className="aspect-auto h-[250px] w-full pt-6"
          config={chartConfig}
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
              axisLine={false}
              dataKey="date"
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                });
              }}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(d) => format(new Date(d), "MMM d")}
                  valueFormatter={(_value) => {
                    const value = typeof _value === "number" ? _value : 0;
                    return <span className="inline-flex gap-1.5">{value}</span>;
                  }}
                />
              }
            />
            {pathnames.map((pathname, idx) => (
              <Bar
                className="stroke-background"
                dataKey={pathname}
                fill={`hsl(var(--chart-${idx + 1}))`}
                key={pathname}
                radius={[
                  idx === pathnames.length - 1 ? 4 : 0,
                  idx === pathnames.length - 1 ? 4 : 0,
                  idx === 0 ? 4 : 0,
                  idx === 0 ? 4 : 0,
                ]}
                stackId="a"
                strokeWidth={1}
              />
            ))}
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
