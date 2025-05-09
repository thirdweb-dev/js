"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { UniversalBridgeStats } from "types/analytics";
import { CardHeading, chartHeight } from "./common";

type GraphData = {
  date: string;
  value: number;
};

export function TotalPayVolume(props: {
  data: UniversalBridgeStats[];
  dateFormat?: {
    month: "short" | "long";
    day?: "numeric" | "2-digit";
  };
}) {
  const uniqueId = useId();
  const [successType, setSuccessType] = useState<"success" | "fail">("success");
  const [type, setType] = useState<"all" | "crypto" | "fiat">("all");

  const graphData: GraphData[] | undefined = useMemo(() => {
    let data = (() => {
      switch (type) {
        case "crypto": {
          return props.data?.filter((x) => x.type === "onchain");
        }
        case "fiat": {
          return props.data?.filter((x) => x.type === "onramp");
        }
        case "all": {
          return props.data;
        }
        default: {
          throw new Error("Invalid tab");
        }
      }
    })();

    data = (() => {
      if (successType === "fail") {
        return data.filter((x) => x.status === "failed");
      }
      return data.filter((x) => x.status === "completed");
    })();

    const dates = new Set<string>();
    for (const item of data) {
      if (!dates.has(item.date)) {
        dates.add(item.date);
      }
    }

    const cleanedData = [];
    for (const date of dates) {
      const items = data.filter((x) => x.date === date);
      const total = items.reduce((acc, curr) => acc + curr.amountUsdCents, 0);
      cleanedData.push({
        date: new Date(date).toLocaleDateString("en-US", {
          ...props.dateFormat,
          timeZone: "UTC",
        }),
        value: total / 100,
      });
    }
    return cleanedData;
  }, [props.data, type, successType, props.dateFormat]);

  const isEmpty =
    graphData.length === 0 || graphData.every((x) => x.value === 0);
  const chartColor = isEmpty
    ? "hsl(var(--muted-foreground))"
    : successType === "success"
      ? "hsl(var(--chart-1))"
      : "hsl(var(--chart-3))";

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardHeading>Volume</CardHeading>

        {props.data && (
          <div className="flex gap-2">
            <Select
              value={type}
              onValueChange={(value: "all" | "crypto" | "fiat") => {
                setType(value);
              }}
            >
              <SelectTrigger className="bg-transparent">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Total</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="fiat">Fiat</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={successType}
              onValueChange={(value: "success" | "fail") => {
                setSuccessType(value);
              }}
            >
              <SelectTrigger className="bg-transparent">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="success">Successful</SelectItem>
                <SelectItem value="fail">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="h-10" />

      <div className="relative flex w-full flex-1 justify-center">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={graphData || emptyGraphData}>
            <defs>
              <linearGradient id={uniqueId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {graphData && (
              <Tooltip
                content={(x) => {
                  const payload = x.payload?.[0]?.payload as
                    | GraphData
                    | undefined;
                  return (
                    <div className="rounded border border-border bg-popover px-4 py-2">
                      <p className="mb-1 text-muted-foreground text-sm">
                        {payload?.date}
                      </p>
                      <p className="text-base text-medium">
                        ${payload?.value.toLocaleString()}
                      </p>
                    </div>
                  );
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              fillOpacity={1}
              fill={`url(#${uniqueId})`}
              strokeWidth={2}
              strokeLinecap="round"
            />

            {graphData && (
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                className="font-sans text-xs"
                stroke="hsl(var(--muted-foreground))"
                dy={10}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const emptyGraphData: GraphData[] = [5, 9, 7, 15, 7, 20].map((x, i, arr) => {
  const date = new Date();
  date.setDate(date.getDate() + i - arr.length);
  return {
    value: x,
    date: date.toISOString(),
  };
});
