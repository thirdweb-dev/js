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
  IntervalSelector,
  NoDataAvailable,
  chartHeight,
} from "./common";

type GraphData = {
  date: string;
  value: number;
};

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

  const volumeQuery = usePayVolume({
    clientId: props.clientId,
    from: props.from,
    intervalType,
    to: props.to,
  });

  return (
    <section className="relative flex flex-col justify-center">
      {!volumeQuery.isError ? (
        <RenderData
          data={volumeQuery.data}
          intervalType={intervalType}
          setIntervalType={setIntervalType}
        />
      ) : (
        <NoDataAvailable />
      )}
    </section>
  );
}

function RenderData(props: {
  data?: PayVolumeData;
  intervalType: "day" | "week";
  setIntervalType: (intervalType: "day" | "week") => void;
}) {
  const uniqueId = useId();
  const [successType, setSuccessType] = useState<"success" | "fail">("success");
  const [type, setType] = useState<"all" | "crypto" | "fiat">("all");

  const graphData: GraphData[] | undefined = props.data?.intervalResults.map(
    (x) => {
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
    },
  );

  if (graphData?.length === 0) {
    return <NoDataAvailable />;
  }

  const chartColor =
    successType === "success"
      ? "hsl(var(--success-foreground))"
      : "hsl(var(--destructive-foreground))";

  return (
    <div className="flex flex-col  flex-1">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:items-center">
        <CardHeading>Volume</CardHeading>

        {graphData && (
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

      <div className="flex justify-center w-full flex-1">
        {graphData ? (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id={uniqueId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <Tooltip
                content={(x) => {
                  const payload = x.payload?.[0]?.payload as
                    | GraphData
                    | undefined;
                  return (
                    <div className="bg-popover px-4 py-2 rounded border border-border">
                      <p className="text-muted-foreground mb-1 text-sm">
                        {payload?.date}
                      </p>
                      <p className="text-medium text-base">
                        ${payload?.value.toLocaleString()}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fillOpacity={1}
                fill={`url(#${uniqueId})`}
                strokeWidth={2}
                strokeLinecap="round"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                className="text-xs font-sans"
                stroke="hsl(var(--muted-foreground))"
                dy={10}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <AreaChartLoadingState height={`${chartHeight}px`} />
        )}
      </div>
    </div>
  );
}
