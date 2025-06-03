"use client";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart } from "recharts";
import { cn } from "../../@/lib/utils";

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

export function EmptyChartState({
  children,
  type,
}: { children?: React.ReactNode; type: "bar" | "area" }) {
  const barChartData = useMemo(() => generateRandomData(), []);

  return (
    <div className="relative z-0 h-full w-full">
      <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center font-medium text-base text-muted-foreground">
        {children ?? "No data available"}
      </div>
      <SkeletonBarChart data={barChartData} type={type} />
    </div>
  );
}

export function LoadingChartState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none flex h-full w-full items-center justify-center rounded-lg bg-muted/30",
        className,
      )}
    >
      <LoadingDots />
    </div>
  );
}

function SkeletonBarChart(props: {
  data: FakeCartData[];
  type: "bar" | "area";
}) {
  return (
    <ChartContainer
      config={skeletonChartConfig}
      className="pointer-events-none h-full w-full blur-[5px]"
    >
      {props.type === "bar" ? (
        <BarChart
          data={props.data}
          margin={{
            top: 20,
          }}
        >
          <Bar dataKey="value" fill="var(--color-value)" radius={8} />
        </BarChart>
      ) : (
        <AreaChart
          data={props.data}
          margin={{
            top: 20,
          }}
        >
          <defs>
            <linearGradient id="fill_area_skeleton" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={"hsl(var(--muted-foreground)/0.5)"}
                stopOpacity={0.8}
              />
              <stop offset="95%" stopColor="transparent" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="natural"
            dataKey="value"
            stroke="hsl(var(--muted-foreground))"
            fill="url(#fill_area_skeleton)"
            radius={8}
          />
        </AreaChart>
      )}
    </ChartContainer>
  );
}
