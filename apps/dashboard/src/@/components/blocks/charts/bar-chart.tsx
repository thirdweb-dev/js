"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

type ThirdwebBarChartProps<TConfig extends ChartConfig> = {
  // metadata
  title: string;
  description?: string;
  // chart config
  config: TConfig;
  data: Array<Record<keyof TConfig, number> & { time: number | string | Date }>;
  showLegend?: boolean;
  variant?: "stacked" | "grouped";
  // chart className
  chartClassName?: string;
};

export function ThirdwebBarChart<TConfig extends ChartConfig>(
  props: ThirdwebBarChartProps<TConfig>,
) {
  const configKeys = useMemo(() => Object.keys(props.config), [props.config]);
  // if there are more than 4 keys then we should stack them by default
  const variant =
    props.variant || configKeys.length > 4 ? "stacked" : "grouped";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        {props.description && (
          <CardDescription>{props.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={props.config} className={props.chartClassName}>
          <BarChart accessibilityLayer data={props.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            {props.showLegend && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {configKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                // if stacked then they should all be the same stackId
                // if grouped then they should all be unique stackId (so the key works great)
                stackId={variant === "stacked" ? "a" : key}
                fill={`var(--color-${key})`}
                // if stacked then we need to figure out the radius based on the index in the array
                // if grouped then we can just use the same radius for all
                radius={
                  variant === "stacked"
                    ? idx === 0
                      ? [0, 0, 4, 4]
                      : idx === configKeys.length - 1
                        ? [4, 4, 0, 0]
                        : [0, 0, 0, 0]
                    : [4, 4, 4, 4]
                }
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
