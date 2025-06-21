"use client";

import {
  EmptyChartState,
  LoadingChartState,
} from "components/analytics/empty-chart-state";
import { format } from "date-fns";
import { useMemo } from "react";
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
import { cn } from "@/lib/utils";

type ThirdwebBarChartProps<TConfig extends ChartConfig> = {
  // metadata
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
  variant?: "stacked" | "grouped";
  // chart className
  chartClassName?: string;
  isPending: boolean;
  toolTipLabelFormatter?: (label: string, payload: unknown) => React.ReactNode;
  toolTipValueFormatter?: (value: unknown) => React.ReactNode;
  hideLabel?: boolean;
  emptyChartState?: React.ReactElement;
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

      <CardContent className={cn(!props.header && "pt-6")}>
        <ChartContainer className={props.chartClassName} config={props.config}>
          {props.isPending ? (
            <LoadingChartState />
          ) : props.data.length === 0 ? (
            <EmptyChartState type="bar">
              {props.emptyChartState}
            </EmptyChartState>
          ) : (
            <BarChart accessibilityLayer data={props.data}>
              <CartesianGrid vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="time"
                tickFormatter={(value) => format(new Date(value), "MMM d")}
                tickLine={false}
                tickMargin={10}
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
              />
              {props.showLegend && (
                <ChartLegend
                  content={<ChartLegendContent className="pt-5" />}
                />
              )}
              {configKeys.map((key) => (
                <Bar
                  className="stroke-background"
                  dataKey={key}
                  // if stacked then they should all be the same stackId
                  // if grouped then they should all be unique stackId (so the key works great)
                  fill={props.config[key]?.color}
                  key={key}
                  radius={[4, 4, 4, 4]}
                  stackId={variant === "stacked" ? "a" : key}
                  strokeWidth={1}
                />
              ))}
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
