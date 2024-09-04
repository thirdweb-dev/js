"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";
import { Bar, BarChart } from "recharts";

type FakeCartData = {
  value: number;
};

function generateRandomData(): FakeCartData[] {
  return Array.from({ length: 30 }, () => ({
    value: Math.floor(Math.random() * 100 + 30),
  }));
}

const skeletonChartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--muted)/90%)",
  },
} satisfies ChartConfig;

export function EmptyChartState() {
  const barChartData = useMemo(() => generateRandomData(), []);

  return (
    <div className="w-full h-full relative">
      <span className="text-base text-muted-foreground font-semibold absolute inset-0 flex items-center justify-center z-[1]">
        No data available
      </span>
      <SkeletonBarChart data={barChartData} />
    </div>
  );
}

export function LoadingChartState() {
  return (
    <div className="w-full h-full pointer-events-none flex items-center justify-center bg-muted/50 rounded-lg">
      <Spinner className="size-10" />
    </div>
  );
}

function SkeletonBarChart(props: {
  data: FakeCartData[];
}) {
  return (
    <ChartContainer
      config={skeletonChartConfig}
      className="w-full h-full pointer-events-none blur-[5px]"
    >
      <BarChart
        data={props.data}
        margin={{
          top: 20,
        }}
      >
        <Bar dataKey="value" fill={"var(--color-value)"} radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
