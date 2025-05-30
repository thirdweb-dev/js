"use client";

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
import { cn } from "@/lib/utils";
import {
  EmptyChartState,
  LoadingChartState,
} from "components/analytics/empty-chart-state";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type ThirdwebAreaChartProps<TConfig extends ChartConfig> = {
  header?: {
    title: string;
    description?: string;
    titleClassName?: string;
  };
  customHeader?: React.ReactNode;
  // chart config
  config: TConfig;
  data: Array<Record<keyof TConfig, number> & { time: number | string | Date }>;
  showLegend?: boolean;

  yAxis?: boolean;
  xAxis?: {
    sameDay?: boolean;
  };

  variant?: "stacked" | "individual";

  // chart className
  chartClassName?: string;
  isPending: boolean;
  className?: string;
  cardContentClassName?: string;
  hideLabel?: boolean;
  toolTipLabelFormatter?: (label: string, payload: unknown) => React.ReactNode;
  toolTipValueFormatter?: (value: unknown) => React.ReactNode;
  emptyChartState?: React.ReactElement;
};

export function ThirdwebAreaChart<TConfig extends ChartConfig>(
  props: ThirdwebAreaChartProps<TConfig>,
) {
  const configKeys = useMemo(() => Object.keys(props.config), [props.config]);

  return (
    <Card className={props.className}>
      {props.header && (
        <CardHeader>
          <CardTitle className={cn("mb-2", props.header.titleClassName)}>
            {props.header.title}
          </CardTitle>
          {props.header.description && (
            <CardDescription>{props.header.description}</CardDescription>
          )}
        </CardHeader>
      )}

      {props.customHeader && props.customHeader}

      <CardContent
        className={cn(!props.header && "pt-6", props.cardContentClassName)}
      >
        <ChartContainer config={props.config} className={props.chartClassName}>
          {props.isPending ? (
            <LoadingChartState />
          ) : props.data.length === 0 ? (
            <EmptyChartState type="area">
              {props.emptyChartState}
            </EmptyChartState>
          ) : (
            <AreaChart accessibilityLayer data={props.data}>
              <CartesianGrid vertical={false} />
              {props.yAxis && <YAxis tickLine={false} axisLine={false} />}
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                tickFormatter={(value) =>
                  formatDate(
                    new Date(value),
                    props.xAxis?.sameDay ? "MMM dd, HH:mm" : "MMM dd",
                  )
                }
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    hideLabel={
                      props.hideLabel !== undefined ? props.hideLabel : true
                    }
                    labelFormatter={props.toolTipLabelFormatter}
                    valueFormatter={props.toolTipValueFormatter}
                  />
                }
              />
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
              {configKeys.map((key) =>
                key === "maxLine" ? (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey="maxLine"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none"
                  />
                ) : (
                  <Area
                    key={key}
                    dataKey={key}
                    type="natural"
                    fill={`url(#fill_${key})`}
                    fillOpacity={0.4}
                    stroke={`var(--color-${key})`}
                    stackId={props.variant !== "stacked" ? undefined : "a"}
                  />
                ),
              )}

              {props.showLegend && (
                <ChartLegend
                  content={<ChartLegendContent className="pt-8" />}
                />
              )}
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
