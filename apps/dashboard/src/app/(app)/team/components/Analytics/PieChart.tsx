"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatTickerNumber } from "lib/format-utils";
import { Pie, PieChart as RechartsPieChart } from "recharts";

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
        label: value.label,
        color: value.fill,
        name,
      },
    ]),
  );

  return (
    <ChartContainer
      config={{
        tooltip: {
          label: title,
        },
        ...chartConfig,
      }}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RechartsPieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              valueFormatter={(v: unknown) => formatTickerNumber(v as number)}
            />
          }
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={60}
          strokeWidth={1}
          stroke="hsl(var(--background))"
        />
      </RechartsPieChart>
    </ChartContainer>
  );
}
