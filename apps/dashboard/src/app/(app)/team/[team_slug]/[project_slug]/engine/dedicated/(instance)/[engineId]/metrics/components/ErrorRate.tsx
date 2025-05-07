"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { type JSX, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
      label: "Errors",
      color: "hsl(var(--chart-5))",
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
          key={tag}
          dataKey={tag}
          type="natural"
          fill={`var(--color-${tag})`}
          fillOpacity={0.3}
          stroke={`var(--color-${tag})`}
          stackId="a"
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
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={monitorData.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  second: undefined,
                  localeMatcher: "lookup",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {areaCharts}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
