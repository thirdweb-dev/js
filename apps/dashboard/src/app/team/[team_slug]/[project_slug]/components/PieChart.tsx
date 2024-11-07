"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={60} />
      </RechartsPieChart>
    </ChartContainer>
  );
}
