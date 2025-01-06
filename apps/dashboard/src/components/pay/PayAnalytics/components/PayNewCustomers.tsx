import { SkeletonContainer } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useEffect, useId, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AreaChartLoadingState } from "../../../analytics/area-chart";
import { usePayNewCustomers } from "../hooks/usePayNewCustomers";
import {
  CardHeading,
  ChangeBadge,
  FailedToLoad,
  IntervalSelector,
  NoDataOverlay,
  chartHeight,
} from "./common";

type GraphDataItem = {
  date: string;
  value: number;
};

type ProcessedQuery = {
  data?: {
    graphData: GraphDataItem[];
    totalNewCustomers: number;
    percentChange: number;
  };
  isError?: boolean;
  isPending?: boolean;
  isEmpty?: boolean;
};

function processQuery(
  newCustomersQuery: ReturnType<typeof usePayNewCustomers>,
): ProcessedQuery {
  if (newCustomersQuery.isPending) {
    return { isPending: true };
  }

  if (newCustomersQuery.isError) {
    return { isError: true };
  }

  if (!newCustomersQuery.data) {
    return { isEmpty: true };
  }

  if (newCustomersQuery.data.intervalResults.length === 0) {
    return { isEmpty: true };
  }

  const newCustomersData: GraphDataItem[] =
    newCustomersQuery.data.intervalResults.map((x) => {
      return {
        date: format(new Date(x.interval), "LLL dd"),
        value: x.distinctCustomers,
      };
    });

  const totalNewCustomers = newCustomersQuery.data.aggregate.distinctCustomers;

  return {
    data: {
      graphData: newCustomersData,
      totalNewCustomers,
      percentChange:
        newCustomersQuery.data.aggregate.bpsIncreaseFromPriorRange / 100,
    },
  };
}

export function PayNewCustomers(props: {
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

  const uiQuery = processQuery(
    usePayNewCustomers({
      clientId: props.clientId,
      from: props.from,
      to: props.to,
      intervalType,
    }),
  );

  return (
    <section className="relative flex min-h-[320px] flex-col">
      {/* header */}
      <div className="mb-1 flex items-center justify-between gap-2">
        <CardHeading>New Customers </CardHeading>

        <div className={!uiQuery.data ? "invisible" : ""}>
          <IntervalSelector
            intervalType={intervalType}
            setIntervalType={setIntervalType}
          />
        </div>
      </div>

      {/* Chart */}
      {!uiQuery.isError ? (
        <RenderData
          query={uiQuery}
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

  const chartColor = props.query.isEmpty
    ? "hsl(var(--muted-foreground))"
    : "hsl(var(--link-foreground))";

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <SkeletonContainer
          loadedData={
            props.query.isEmpty ? "NA" : props.query.data?.totalNewCustomers
          }
          skeletonData={100}
          render={(v) => {
            return (
              <p className="font-semibold text-4xl tracking-tighter">{v}</p>
            );
          }}
        />

        {!props.query.isEmpty && (
          <SkeletonContainer
            loadedData={props.query.data?.percentChange}
            className="rounded-2xl"
            skeletonData={1}
            render={(v) => {
              return <ChangeBadge percent={v} />;
            }}
          />
        )}
      </div>

      <div className="relative flex w-full justify-center ">
        {props.query.isPending ? (
          <AreaChartLoadingState height={`${chartHeight}px`} />
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={props.query.data?.graphData || emptyGraphData}>
              <defs>
                <linearGradient id={uniqueId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <Tooltip
                content={(x) => {
                  const payload = x.payload?.[0]?.payload as
                    | GraphDataItem
                    | undefined;
                  return (
                    <div className="rounded border border-border bg-popover px-4 py-2">
                      <p className="mb-1 text-muted-foreground text-sm">
                        {payload?.date}
                      </p>
                      <p className="text-base text-medium">
                        Customers: {payload?.value}
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

              {props.query.data && (
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  className="mt-5 font-sans text-xs"
                  stroke="hsl(var(--muted-foreground))"
                  dy={12}
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
const emptyGraphData: GraphDataItem[] = [5, 9, 7, 15, 7, 20].map(
  (x, i, arr) => {
    const date = new Date();
    date.setDate(date.getDate() + i - arr.length);
    return {
      value: x,
      date: date.toISOString(),
    };
  },
);
