"use client";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyChartState } from "@/components/analytics/empty-chart-state";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatTickerNumber } from "@/utils/format-utils";
import { toUSD } from "@/utils/number";

export function BarChart({
  chartConfig,
  data,
  activeKey,
  tooltipLabel,
  isCurrency = false,
  emptyChartContent,
}: {
  chartConfig: ChartConfig;
  data: { [key in string]: number | string }[];
  activeKey: string;
  tooltipLabel?: string;
  isCurrency?: boolean;
  emptyChartContent?: React.ReactNode;
}) {
  return (
    <ChartContainer
      className="aspect-auto h-[250px] w-full pt-6"
      config={{
        [activeKey]: {
          label: tooltipLabel ?? chartConfig[activeKey]?.label,
        },
        ...chartConfig,
      }}
    >
      {data.length === 0 || data.every((d) => d[activeKey] === 0) ? (
        <EmptyChartState type="bar"> {emptyChartContent} </EmptyChartState>
      ) : (
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
          <YAxis
            axisLine={false}
            dataKey={activeKey}
            tickFormatter={(value: number) => formatTickerNumber(value)}
            tickLine={false}
            width={48}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[200px]"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                }}
                nameKey={activeKey}
                valueFormatter={(v: unknown) =>
                  isCurrency || chartConfig[activeKey]?.isCurrency
                    ? toUSD(v as number)
                    : formatTickerNumber(v as number)
                }
              />
            }
          />
          <Bar
            className="stroke-background"
            dataKey={activeKey}
            fill={chartConfig[activeKey]?.color ?? "hsl(var(--chart-1))"}
            radius={4}
            strokeWidth={1}
          />
        </RechartsBarChart>
      )}
    </ChartContainer>
  );
}
