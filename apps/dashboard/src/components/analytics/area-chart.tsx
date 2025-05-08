"use client";
import { cn } from "@/lib/utils";
import { useEffect, useId, useState } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomToolTip } from "./custom-tooltip";

type GenericDataType = Record<string, string | number>;

type IndexType = "date";

interface AreaChartProps<
  TData extends GenericDataType,
  TIndexKey extends keyof TData,
> {
  data: TData[];
  index: {
    id: TIndexKey;
    label?: string;
    type?: IndexType;
    format?: (index: TData[TIndexKey]) => string;
  };

  categories: Array<{
    id: keyof TData;
    label?: string;
    color?: string;
    format?: (value: number) => string;
  }>;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
  className?: string;
  isAnimationActive?: boolean;
}

const AreaChart = <
  TData extends GenericDataType,
  TIndexKey extends keyof TData,
>({
  data,
  index,
  categories,
  showXAxis,
  showYAxis,
  startEndOnly,
  className,
}: AreaChartProps<TData, TIndexKey>) => {
  const id = useId();

  if (!data.length) {
    return null;
  }

  const indexType = index.type || "date";
  const firstData = data[0];
  const lastData = data[data.length - 1];
  const firstDataAtIndexId = firstData?.[index.id];
  const lastDataAtIndexId = lastData?.[index.id];

  return (
    <div className={cn("h-full w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          <defs>
            {categories.map((cat) => (
              <linearGradient
                key={`${cat.id as string}`}
                id={`area_color_${id}_${cat.id as string}`}
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="5%"
                  stopColor={cat.color || "#3385FF"}
                  stopOpacity={0.4}
                />
                <stop
                  offset="75%"
                  stopColor={cat.color || "#3385FF"}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>

          {categories.map((cat) => (
            <Area
              key={`${cat.id as string}`}
              type="natural"
              dataKey={cat.id as string}
              stroke={cat.color || "#3385FF"}
              fill={`url(#area_color_${id}_${cat.id as string})`}
              dot={false}
              activeDot={{
                strokeWidth: 0,
              }}
              strokeWidth={1.5}
            />
          ))}
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            content={({ active, payload }) => {
              const payloadKey = payload?.[0]?.dataKey;
              const category = categories.find((cat) => cat.id === payloadKey);
              return (
                <CustomToolTip
                  active={active}
                  payload={payload}
                  valueLabel={category?.label || ""}
                  valueFormatter={category?.format}
                />
              );
            }}
            cursor={{
              stroke: "#3385FF",
              fill: "#3385FF",
              opacity: 0.3,
              strokeDasharray: 2,
              strokeWidth: 1.5,
            }}
          />

          <XAxis
            hide={!showXAxis}
            dataKey={index.id as string}
            tickFormatter={(payload) =>
              index.format
                ? index.format(payload)
                : indexType === "date"
                  ? new Date(payload).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : payload
            }
            className="font-sans text-xs"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            interval="preserveStartEnd"
            minTickGap={5}
            domain={["dataMin", "dataMax"]}
            type="number"
            tick={{ transform: "translate(0, 6)" }}
            ticks={
              startEndOnly && firstDataAtIndexId && lastDataAtIndexId
                ? [firstDataAtIndexId, lastDataAtIndexId]
                : undefined
            }
          />

          <YAxis
            hide={!showYAxis}
            width={60}
            tickFormatter={(payload) => {
              const category = categories[0];
              return category?.format
                ? category.format(payload)
                : payload.toString();
            }}
            className="font-sans text-xs"
            domain={([dataMin, dataMax]) => [
              // start from 0 unless dataMin is below 0 in which case start from dataMin - 10%
              Math.min(0, dataMin - Math.round(dataMin * 0.1)),
              // add 10% to the top
              dataMax + Math.round(dataMax * 0.1),
            ]}
            tick={{ transform: "translate(-3, 0)" }}
            type="number"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            interval="preserveStartEnd"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

function randomNumber(min = 0, max = 100) {
  return Math.random() * (max - min) + min;
}

function generateFakeData() {
  const data = [];
  for (let i = 0; i < 7; i++) {
    data.push({
      key: i,
      value: randomNumber(i * 10, i * 10 + 30),
    });
  }
  return data;
}

export const AreaChartLoadingState = (props: { height?: string }) => {
  const [loadingData, setLoadingData] = useState(() => generateFakeData());

  // legitimate use case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingData(generateFakeData());
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className="relative w-full"
      style={{
        height: props.height,
      }}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center filter backdrop-blur-sm">
        <p className="text-muted-foreground">Loading Chart</p>
      </div>
      <AreaChart
        className="pointer-events-none"
        data={loadingData}
        index={{ id: "key" }}
        categories={[{ id: "value", color: "hsl(var(--muted-foreground))" }]}
      />
    </div>
  );
};
