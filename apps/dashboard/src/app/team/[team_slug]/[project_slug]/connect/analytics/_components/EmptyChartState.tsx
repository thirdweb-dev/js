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
    <div className="relative z-0 h-full w-full">
      <span className="absolute inset-0 z-[1] flex items-center justify-center font-semibold text-base text-muted-foreground">
        No data available
      </span>
      <SkeletonBarChart data={barChartData} />
    </div>
  );
}

export function LoadingChartState() {
  return (
    <div className="pointer-events-none flex h-full w-full items-center justify-center rounded-lg bg-muted/50">
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
      className="pointer-events-none h-full w-full blur-[5px]"
    >
      <BarChart
        data={props.data}
        margin={{
          top: 20,
        }}
      >
        <Bar dataKey="value" fill="var(--color-value)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
