"use client";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
} from "recharts";
import { EmptyChartState } from "@/components/analytics/empty-chart-state";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { formatTickerNumber } from "@/utils/format-utils";
import { toUSD } from "@/utils/number";

export function BarChart({
  chartConfig,
  data,
  activeKey,
  tooltipLabel,
  isCurrency = false,
  emptyChartContent,
  chartContentClassName,
}: {
  chartConfig: ChartConfig & {
    [k: string]: {
      stackedKeys?: string[];
    };
  };
  data: { [key in string]: number | string }[];
  activeKey: string;
  tooltipLabel?: string;
  isCurrency?: boolean;
  emptyChartContent?: React.ReactNode;
  chartContentClassName?: string;
}) {
  const stackedKeys =
    (chartConfig?.[activeKey] as { stackedKeys?: string[] } | undefined)
      ?.stackedKeys || undefined;

  const isEmpty =
    data.length === 0 ||
    (stackedKeys && stackedKeys.length > 0
      ? data.every((d) => stackedKeys.every((k) => (Number(d[k]) || 0) === 0))
      : data.every((d) => (Number(d[activeKey]) || 0) === 0));

  return (
    <ChartContainer
      className={cn("aspect-auto h-[275px] w-full pt-6", chartContentClassName)}
      config={{
        [activeKey]: {
          label: tooltipLabel ?? chartConfig[activeKey]?.label,
        },
        ...chartConfig,
      }}
    >
      {isEmpty ? (
        <div className="h-full">
          <EmptyChartState content={emptyChartContent} />
        </div>
      ) : (
        <RechartsBarChart accessibilityLayer data={data}>
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
                nameKey={
                  stackedKeys && stackedKeys.length > 0 ? undefined : activeKey
                }
                valueFormatter={(v: unknown) =>
                  isCurrency || chartConfig[activeKey]?.isCurrency
                    ? toUSD(v as number)
                    : formatTickerNumber(v as number)
                }
              />
            }
          />
          {stackedKeys && stackedKeys.length > 0 ? (
            stackedKeys.map((k) => (
              <Bar
                key={k}
                className="stroke-background"
                dataKey={k}
                fill={
                  chartConfig[k]?.color ??
                  chartConfig[activeKey]?.color ??
                  "hsl(var(--chart-1))"
                }
                radius={4}
                strokeWidth={1}
                stackId={activeKey}
              />
            ))
          ) : (
            <Bar
              className="stroke-background"
              dataKey={activeKey}
              fill={chartConfig[activeKey]?.color ?? "hsl(var(--chart-1))"}
              radius={4}
              strokeWidth={1}
            />
          )}
        </RechartsBarChart>
      )}
    </ChartContainer>
  );
}
