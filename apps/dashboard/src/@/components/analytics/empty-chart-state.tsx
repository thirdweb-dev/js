"use client";
import { XIcon } from "lucide-react";
import { useId, useMemo } from "react";
import { Area, AreaChart, Bar, BarChart } from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { cn } from "@/lib/utils";

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
    color: "hsl(var(--muted)/90%)",
    label: "Value",
  },
} satisfies ChartConfig;

export function EmptyChartState({
  children,
  type,
}: {
  children?: React.ReactNode;
  type: "bar" | "area" | "none";
}) {
  const barChartData = useMemo(() => generateRandomData(), []);

  return (
    <div className="relative z-0 h-full w-full">
      <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center text-base text-muted-foreground">
        {children || (
          <div className="flex items-center gap-3 flex-col">
            <div className="rounded-full border p-2 bg-background">
              <XIcon className="size-4" />
            </div>
            <p className="text-base"> No data available </p>
          </div>
        )}
      </div>
      {type !== "none" && <SkeletonBarChart data={barChartData} type={type} />}
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
  const fillAreaSkeletonId = useId();
  return (
    <ChartContainer
      className="pointer-events-none h-full w-full blur-[5px] aspect-auto"
      config={skeletonChartConfig}
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
            <linearGradient id={fillAreaSkeletonId} x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="5%"
                stopColor={"hsl(var(--muted-foreground)/0.5)"}
                stopOpacity={0.8}
              />
              <stop offset="95%" stopColor="transparent" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            fill={`url(#${fillAreaSkeletonId})`}
            radius={8}
            stroke="hsl(var(--muted-foreground))"
            type="monotone"
          />
        </AreaChart>
      )}
    </ChartContainer>
  );
}
