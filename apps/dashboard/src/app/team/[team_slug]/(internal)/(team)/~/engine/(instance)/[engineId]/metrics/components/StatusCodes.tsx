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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type JSX, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export interface ResultItem {
  metric: {
    code: string;
  };
  values: [number, number][];
}

function getReturnedCodes(result: ResultItem[]) {
  const seriesCodes: { [key: string]: string | null } = {};
  for (const item of result.reverse()) {
    seriesCodes[item.metric.code] = null;
  }
  return seriesCodes;
}

function transformPrometheusData(timeseriesDatapoints: ResultItem[]) {
  const codes = getReturnedCodes(timeseriesDatapoints);
  const timeMap = new Map();

  for (const datapoint of timeseriesDatapoints) {
    const code = datapoint.metric.code;

    for (const [timestamp, value] of datapoint.values) {
      if (!timeMap.has(timestamp)) {
        timeMap.set(timestamp, {
          time: new Date(timestamp * 1000).toISOString(),
          ...codes,
        });
      }

      const timeItem = timeMap.get(timestamp);
      timeItem[code] = value;
    }
  }

  return {
    data: Array.from(timeMap.values()),
    tags: Object.keys(codes),
  };
}

export function StatusCodes({ datapoints }: { datapoints: ResultItem[] }) {
  const monitorData = transformPrometheusData(datapoints);

  const chartConfig = useMemo(() => {
    if (!monitorData || !monitorData.data || !monitorData.tags) {
      return {};
    }

    const config: { [key: string]: { label: string; color: string } } = {};
    for (const tag of monitorData.tags) {
      config[tag] = {
        label: tag,
        color:
          Number.parseInt(tag) < 400
            ? "hsl(var(--chart-2))"
            : Number.parseInt(tag) < 500
              ? "hsl(var(--chart-3))"
              : "hsl(var(--chart-5))",
      };
    }

    return config;
  }, [monitorData]);

  const areaCharts = useMemo(() => {
    const charts: JSX.Element[] = [];
    if (!monitorData || !monitorData.data || !monitorData.tags) {
      return <Spinner className="mx-auto size-8" />;
    }

    for (const tag of monitorData.tags) {
      charts.push(
        <Area
          key={tag}
          dataKey={tag}
          type="step"
          fill={`var(--color-${tag})`}
          fillOpacity={0.3}
          stroke={`var(--color-${tag})`}
          stackId="a"
        />,
      );
    }
    return charts.reverse();
  }, [monitorData]);

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-lg">Status Codes</CardTitle>
        <CardDescription>
          Total requests by HTTP status (last 24 hours)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart accessibilityLayer data={monitorData.data}>
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
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
