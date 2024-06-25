import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { SkeletonContainer } from "../../../../@/components/ui/skeleton";
import { AreaChartLoadingState } from "../../../analytics/area-chart";
import { usePayVolume } from "../hooks/usePayVolume";
import {
  CardHeading,
  ChangeBadge,
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
  data?: {
    totalPayoutsUSD: number;
    graphData: GraphData[];
    percentChange: number;
  };
  isError?: boolean;
  isEmpty?: boolean;
  isLoading?: boolean;
};

function processQuery(query: ReturnType<typeof usePayVolume>): ProcessedQuery {
  if (query.isLoading) {
    return { isLoading: true };
  }

  if (query.isError) {
    return { isError: true };
  }

  if (query.data.intervalResults.length === 0) {
    return { isEmpty: true };
  }

  const graphData: GraphData[] = query.data.intervalResults.map((result) => ({
    date: format(new Date(result.interval), "LLL dd"),
    value: result.payouts.amountUSDCents / 100,
  }));

  const totalPayoutsUSD = query.data.aggregate.payouts.amountUSDCents / 100;

  const percentChange =
    query.data.aggregate.payouts.bpsIncreaseFromPriorRange / 100;

  return {
    data: {
      graphData,
      percentChange,
      totalPayoutsUSD,
    },
  };
}

export function Payouts(props: {
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
    usePayVolume({
      clientId: props.clientId,
      from: props.from,
      to: props.to,
      intervalType,
    }),
  );

  return (
    <section className="relative flex flex-col justify-center w-full">
      {/* header */}
      <div className="flex justify-between gap-2 items-center mb-1">
        <CardHeading> Payouts </CardHeading>

        {uiQuery.data && (
          <IntervalSelector
            intervalType={intervalType}
            setIntervalType={setIntervalType}
          />
        )}
      </div>

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
  const barColor = props.query.isEmpty
    ? "hsl(var(--accent))"
    : "hsl(var(--link-foreground))";
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <SkeletonContainer
          loadedData={
            props.query.isEmpty
              ? "$-"
              : props.query.data
                ? `$${props.query.data?.totalPayoutsUSD}`
                : undefined
          }
          skeletonData={"$20"}
          render={(value) => {
            return (
              <p className="text-4xl tracking-tighter font-semibold">{value}</p>
            );
          }}
        />

        {!props.query.isEmpty && (
          <SkeletonContainer
            className="rounded-2xl"
            loadedData={props.query.data?.percentChange}
            skeletonData={1}
            render={(percent) => {
              return <ChangeBadge percent={percent} />;
            }}
          />
        )}
      </div>

      <div className="relative flex justify-center w-full">
        {props.query.isLoading ? (
          <AreaChartLoadingState height={`${chartHeight}px`} />
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={props.query.data?.graphData || emptyGraphData}>
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
                cursor={{ fill: "hsl(var(--accent))", radius: 8 }}
              />
              <Bar
                dataKey="value"
                stroke="none"
                fillOpacity={1}
                fill={barColor}
                radius={8}
                barSize={20}
              />

              {props.query.data && (
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-sans"
                  stroke="hsl(var(--muted-foreground))"
                  dy={10}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {props.query.isEmpty && <NoDataOverlay />}
      </div>

      {props.query.data && (
        <div className="absolute top-0 right-0">
          <IntervalSelector
            intervalType={props.intervalType}
            setIntervalType={props.setIntervalType}
          />
        </div>
      )}
    </div>
  );
}

const emptyGraphData: GraphData[] = [
  5, 9, 7, 15, 7, 20, 5, 9, 7, 15, 7, 20,
].map((x, i, arr) => {
  const date = new Date();
  date.setDate(date.getDate() + i - arr.length);
  return {
    value: x,
    date: date.toISOString(),
  };
});
