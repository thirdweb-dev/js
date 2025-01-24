"use client";

import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";

export function ChartUI(props: {
  data: Array<{ time: Date; count: number }>;
  isPending: boolean;
}) {
  return (
    <ThirdwebBarChart
      title="Test"
      data={props.data}
      config={{
        count: {
          label: "Foo",
          color: "hsl(var(--chart-1))",
        },
      }}
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      isPending={props.isPending}
    />
  );
}
