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

export function EmptyChartState({ children }: { children?: React.ReactNode }) {
  const barChartData = useMemo(() => generateRandomData(), []);

  return (
    <div className="relative z-0 h-full w-full">
      <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center font-medium text-base text-muted-foreground">
        {children ?? "No data available"}
      </div>
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
