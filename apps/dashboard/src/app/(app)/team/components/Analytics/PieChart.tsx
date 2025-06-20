"use client";

import { formatTickerNumber } from "lib/format-utils";
import { Pie, PieChart as RechartsPieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function PieChart({
  title,
  data,
}: {
  title: string;
  data: { value: number; label: string; fill?: string }[];
}) {
  const chartConfig: ChartConfig = Object.fromEntries(
    Object.entries(data).map(([name, value]) => [
      value.label,
      {
        color: value.fill,
        label: value.label,
        name,
      },
    ]),
  );

  return (
    <ChartContainer
      className="mx-auto aspect-square max-h-[250px]"
      config={{
        tooltip: {
          label: title,
        },
        ...chartConfig,
      }}
    >
      <RechartsPieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              valueFormatter={(v: unknown) => formatTickerNumber(v as number)}
            />
          }
          cursor={false}
        />
        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          nameKey="label"
          stroke="hsl(var(--background))"
          strokeWidth={1}
        />
      </RechartsPieChart>
    </ChartContainer>
  );
}
