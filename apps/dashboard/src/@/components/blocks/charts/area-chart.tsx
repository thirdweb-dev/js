"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  EmptyChartState,
  LoadingChartState,
} from "@/components/analytics/empty-chart-state";
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

type ThirdwebAreaChartProps<TConfig extends ChartConfig> = {
  header?: {
    title: string;
    description?: string;
    titleClassName?: string;
    headerClassName?: string;
    icon?: React.ReactNode;
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
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
};

export function ThirdwebAreaChart<TConfig extends ChartConfig>(
  props: ThirdwebAreaChartProps<TConfig>,
) {
  const configKeys = useMemo(() => Object.keys(props.config), [props.config]);

  return (
    <Card className={props.className}>
      {props.header && (
        <CardHeader className={props.header.headerClassName}>
          {props.header.icon}
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
        <ChartContainer className={props.chartClassName} config={props.config}>
          {props.isPending ? (
            <LoadingChartState />
          ) : props.data.length === 0 ? (
            <EmptyChartState type="area">
              {props.emptyChartState}
            </EmptyChartState>
          ) : (
            <AreaChart
              accessibilityLayer
              data={props.data}
              margin={{
                right: props.margin?.right ?? 0,
                left: props.margin?.left ?? 0,
                bottom: props.margin?.bottom ?? 10,
                top: props.margin?.top ?? 0,
              }}
            >
              <CartesianGrid vertical={false} />
              {props.yAxis && <YAxis axisLine={false} tickLine={false} />}
              <XAxis
                axisLine={false}
                dataKey="time"
                tickFormatter={(value) =>
                  format(
                    new Date(value),
                    props.xAxis?.sameDay ? "MMM dd, HH:mm" : "MMM dd",
                  )
                }
                tickLine={false}
                tickMargin={20}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel={
                      props.hideLabel !== undefined ? props.hideLabel : true
                    }
                    labelFormatter={props.toolTipLabelFormatter}
                    valueFormatter={props.toolTipValueFormatter}
                  />
                }
                cursor={true}
              />
              <defs>
                {configKeys.map((key) => (
                  <linearGradient
                    id={`fill_${key}`}
                    key={key}
                    x1="0"
                    x2="0"
                    y1="0"
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
                    dataKey="maxLine"
                    fill="none"
                    key={key}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    type="monotone"
                  />
                ) : (
                  <Area
                    dataKey={key}
                    fill={`url(#fill_${key})`}
                    fillOpacity={0.4}
                    key={key}
                    stackId={props.variant !== "stacked" ? undefined : "a"}
                    stroke={`var(--color-${key})`}
                    type="monotone"
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
