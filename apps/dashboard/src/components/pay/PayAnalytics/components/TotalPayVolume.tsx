import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useEffect, useId, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AreaChartLoadingState } from "../../../analytics/area-chart";
import { type PayVolumeData, usePayVolume } from "../hooks/usePayVolume";
import {
  CardHeading,
  FailedToLoad,
  IntervalSelector,
  NoDataOverlay,
  chartHeight,
} from "./common";

type GraphData = {
  date: string;
  value: number;
};

type ProcessedQuery = {
  data?: PayVolumeData;
  isError?: boolean;
  isEmpty?: boolean;
  isPending?: boolean;
};

function processQuery(
  volumeQuery: ReturnType<typeof usePayVolume>,
): ProcessedQuery {
  if (volumeQuery.isPending) {
    return { isPending: true };
  }

  if (volumeQuery.isError) {
    return { isError: true };
  }
  if (!volumeQuery.data) {
    return { isEmpty: true };
  }

  if (volumeQuery.data.intervalResults.length === 0) {
    return { isEmpty: true };
  }

  return {
    data: volumeQuery.data,
  };
}

export function TotalPayVolume(props: {
  clientId: string;
  from: Date;
  to: Date;
  numberOfDays: number;
}) {
  const [intervalType, setIntervalType] = useState<"day" | "week">(
    props.numberOfDays > 30 ? "week" : "day",
  );

  // if prop changes, update intervalType
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setIntervalType(props.numberOfDays > 30 ? "week" : "day");
  }, [props.numberOfDays]);

  const volumeQuery = processQuery(
    usePayVolume({
      clientId: props.clientId,
      from: props.from,
      intervalType,
      to: props.to,
    }),
  );

  return (
    <section className="relative flex flex-col justify-center">
      {!volumeQuery.isError ? (
        <RenderData
          query={volumeQuery}
          intervalType={intervalType}
          setIntervalType={setIntervalType}
        />
      ) : (
        <FailedToLoad />
      )}
    </section>
  );
}

function RenderData(props: {
  query: ProcessedQuery;
  intervalType: "day" | "week";
  setIntervalType: (intervalType: "day" | "week") => void;
}) {
  const uniqueId = useId();
  const [successType, setSuccessType] = useState<"success" | "fail">("success");
  const [type, setType] = useState<"all" | "crypto" | "fiat">("all");

  const graphData: GraphData[] | undefined =
    props.query.data?.intervalResults.map((x) => {
      const date = format(new Date(x.interval), "LLL dd");

      switch (type) {
        case "crypto": {
          return {
            date,
            value:
              x.buyWithCrypto[
                successType === "success" ? "succeeded" : "failed"
              ].amountUSDCents / 100,
          };
        }

        case "fiat": {
          return {
            date,
            value:
              x.buyWithFiat[successType === "success" ? "succeeded" : "failed"]
                .amountUSDCents / 100,
          };
        }

        case "all": {
          return {
            date,
            value:
              x.sum[successType === "success" ? "succeeded" : "failed"]
                .amountUSDCents / 100,
          };
        }

        default: {
          throw new Error("Invalid tab");
        }
      }
    });

  const chartColor = props.query.isEmpty
    ? "hsl(var(--muted-foreground))"
    : successType === "success"
      ? "hsl(var(--chart-1))"
      : "hsl(var(--chart-3))";

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardHeading>Volume</CardHeading>

        {props.query.data && (
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

            <IntervalSelector
              intervalType={props.intervalType}
              setIntervalType={props.setIntervalType}
            />
          </div>
        )}
      </div>

      <div className="h-10" />

      <div className="relative flex w-full flex-1 justify-center">
        {props.query.isPending ? (
          <AreaChartLoadingState height={`${chartHeight}px`} />
        ) : (
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
        )}

        {props.query.isEmpty && <NoDataOverlay />}
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
