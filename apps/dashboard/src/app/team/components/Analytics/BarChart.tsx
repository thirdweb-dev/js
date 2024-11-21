"use client";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatTickerNumber } from "lib/format-utils";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { toUSD } from "utils/number";
import { EmptyChartState } from "../../../../components/analytics/empty-chart-state";

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
      config={{
        [activeKey]: {
          label: tooltipLabel ?? chartConfig[activeKey]?.label,
        },
        ...chartConfig,
      }}
      className="aspect-auto h-[250px] w-full pt-6"
    >
      {data.length === 0 ? (
        <EmptyChartState> {emptyChartContent} </EmptyChartState>
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
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            width={48}
            dataKey={activeKey}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatTickerNumber(value)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[200px]"
                nameKey={activeKey}
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                valueFormatter={(v: unknown) =>
                  isCurrency
                    ? toUSD(v as number)
                    : formatTickerNumber(v as number)
                }
              />
            }
          />
          <Bar
            dataKey={activeKey}
            radius={4}
            fill={chartConfig[activeKey]?.color ?? "hsl(var(--chart-1))"}
          />
        </RechartsBarChart>
      )}
    </ChartContainer>
  );
}
