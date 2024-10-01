"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ThirdwebAreaChartProps<TConfig extends ChartConfig> = {
  // chart config
  config: TConfig;
  data: Array<Record<keyof TConfig, number> & { time: number | string | Date }>;
  showLegend?: boolean;

  // chart className
  chartClassName?: string;
};

export function ThirdwebAreaChart<TConfig extends ChartConfig>(
  props: ThirdwebAreaChartProps<TConfig>,
) {
  const configKeys = useMemo(() => Object.keys(props.config), [props.config]);
  return (
    <div className="rounded-lg border border-border bg-muted/50 px-4 pt-10 pb-4">
      <ChartContainer config={props.config} className={props.chartClassName}>
        <AreaChart
          accessibilityLayer
          data={props.data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={20}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            {configKeys.map((key) => (
              <linearGradient
                key={key}
                id={`fill_${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          {configKeys.map((key) => (
            <Area
              key={key}
              dataKey={key}
              type="natural"
              fill={`url(#fill_${key})`}
              fillOpacity={0.4}
              stroke={`var(--color-${key})`}
              stackId="a"
            />
          ))}

          {props.showLegend && (
            <ChartLegend content={<ChartLegendContent />} className="pt-8" />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
