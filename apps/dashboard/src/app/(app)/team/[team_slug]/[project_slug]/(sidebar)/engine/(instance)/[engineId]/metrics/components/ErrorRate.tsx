"use client";

import { type JSX, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/Spinner";
import type { ResultItem } from "./StatusCodes";

function transformPrometheusData(timeseriesDatapoints: ResultItem[]) {
  const results = [];
  for (const datapoint of timeseriesDatapoints) {
    for (const [timestamp, value] of datapoint.values) {
      results.push({
        time: new Date(timestamp * 1000).toISOString(),
        value: value,
      });
    }
  }

  return {
    data: results,
    tags: ["value"],
  };
}

export function ErrorRate({ datapoints }: { datapoints: ResultItem[] }) {
  const monitorData = transformPrometheusData(datapoints);

  const chartConfig: { [key: string]: { label: string; color: string } } = {
    value: {
      color: "hsl(var(--chart-5))",
      label: "Errors",
    },
  } satisfies ChartConfig;

  const areaCharts = useMemo(() => {
    const charts: JSX.Element[] = [];
    if (monitorData.tags === undefined) {
      return <Spinner className="mx-auto size-8" />;
    }
    for (const tag of monitorData.tags) {
      charts.push(
        <Bar
          dataKey={tag}
          fill={`var(--color-${tag})`}
          fillOpacity={0.3}
          key={tag}
          stackId="a"
          stroke={`var(--color-${tag})`}
        />,
      );
    }
    return charts;
  }, [monitorData]);

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-lg">Error Count</CardTitle>
        <CardDescription>The total 5xx count (last 24 hours)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={monitorData.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="time"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  localeMatcher: "lookup",
                  minute: "numeric",
                  second: undefined,
                });
              }}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickCount={3}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            {areaCharts}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
