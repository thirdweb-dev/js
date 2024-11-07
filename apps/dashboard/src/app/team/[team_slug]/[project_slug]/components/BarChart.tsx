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

export function BarChart({
  chartConfig,
  data,
  activeKey,
  tooltipLabel,
}: {
  chartConfig: ChartConfig;
  data: { [key in string]: number | string }[];
  activeKey: string;
  tooltipLabel?: string;
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
          width={32}
          dataKey={activeKey}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => formatTickerNumber(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey={activeKey}
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <Bar
          dataKey={activeKey}
          radius={4}
          fill={chartConfig[activeKey]?.color ?? "hsl(var(--chart-1))"}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
}
