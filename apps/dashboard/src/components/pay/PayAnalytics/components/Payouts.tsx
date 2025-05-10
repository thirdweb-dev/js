"use client";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { UniversalBridgeStats } from "types/analytics";
import { toUSD } from "../../../../utils/number";
import { CardHeading, ChangeBadge, NoDataOverlay, chartHeight } from "./common";

type GraphData = {
  date: string;
  value: number;
};

export function Payouts(props: {
  data: UniversalBridgeStats[];
  dateFormat?: {
    month: "short" | "long";
    day?: "numeric" | "2-digit";
  };
}) {
  const isEmpty =
    !props.data ||
    props.data.length === 0 ||
    props.data.every((x) => x.developerFeeUsdCents === 0);

  const barColor = isEmpty ? "hsl(var(--accent))" : "hsl(var(--chart-1))";
  const { graphData, totalPayoutsUSD, trend } = useMemo(() => {
    const dates = new Set<string>();
    for (const item of props.data) {
      if (!dates.has(item.date)) {
        dates.add(item.date);
      }
    }

    const cleanedData = [];
    let totalPayouts = 0;
    for (const date of dates) {
      const items = props.data.filter((x) => x.date === date);
      const total = items.reduce(
        (acc, curr) => acc + curr.developerFeeUsdCents,
        0,
      );
      totalPayouts += total;
      cleanedData.push({
        date: new Date(date).toLocaleDateString("en-US", {
          ...props.dateFormat,
          timeZone: "UTC",
        }),
        value: total / 100,
      });
    }
    const lastPeriod = cleanedData[cleanedData.length - 2];
    const currentPeriod = cleanedData[cleanedData.length - 1];
    const trend =
      lastPeriod && currentPeriod && lastPeriod.value > 0
        ? (currentPeriod.value - lastPeriod.value) / lastPeriod.value
        : lastPeriod?.value === 0
          ? 100
          : 0;
    return {
      graphData: cleanedData,
      totalPayoutsUSD: totalPayouts / 100,
      trend,
    };
  }, [props.data, props.dateFormat]);

  return (
    <section className="relative flex w-full flex-col justify-center">
      {/* header */}
      <div className="mb-1 flex items-center justify-between gap-2">
        <CardHeading> Payouts </CardHeading>
        <div />
      </div>
      <div className="w-full">
        <div className="mb-5 flex items-center gap-3">
          <SkeletonContainer
            loadedData={
              !props.data
                ? undefined
                : props.data.length > 0
                  ? toUSD(totalPayoutsUSD)
                  : "NA"
            }
            skeletonData="$20"
            render={(value) => {
              return (
                <p className="font-semibold text-4xl tracking-tighter">
                  {value}
                </p>
              );
            }}
          />

          {!isEmpty && (
            <SkeletonContainer
              className="rounded-2xl"
              loadedData={trend}
              skeletonData={1}
              render={(percent) => {
                return <ChangeBadge percent={percent} />;
              }}
            />
          )}
        </div>

        <div className="relative flex w-full justify-center">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={isEmpty ? emptyGraphData : graphData}>
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
                cursor={{ fill: "hsl(var(--accent))", radius: 8 }}
              />
              <Bar
                dataKey="value"
                stroke="none"
                fillOpacity={1}
                fill={barColor}
                radius={8}
                barSize={20}
                strokeWidth={1}
                className="stroke-background"
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
            </BarChart>
          </ResponsiveContainer>

          {isEmpty && <NoDataOverlay />}
        </div>
      </div>
    </section>
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
