"use client";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { useId, useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { UniversalBridgeWalletStats } from "types/analytics";
import { CardHeading, ChangeBadge, NoDataOverlay, chartHeight } from "./common";

type GraphDataItem = {
  date: string;
  value: number;
};

export function PayNewCustomers(props: {
  data: UniversalBridgeWalletStats[];
  dateFormat?: {
    month: "short" | "long";
    day?: "numeric" | "2-digit";
  };
}) {
  /**
   * For each date, compute the total number of wallets that have never existed before in the time series
   */
  const { graphData, trend } = useMemo(() => {
    const dates = new Set<string>();
    for (const item of props.data) {
      if (!dates.has(item.date)) {
        dates.add(item.date);
      }
    }

    const seenUsers = new Set<string>();
    const newUsersData = [];
    for (const date of dates) {
      const items = props.data.filter((x) => x.date === date);
      const newUsers = items.reduce((acc, user) => {
        if (!seenUsers.has(user.walletAddress) && user.amountUsdCents > 0) {
          seenUsers.add(user.walletAddress);
          return acc + 1;
        }
        return acc;
      }, 0);
      newUsersData.push({
        date: new Date(date).toLocaleDateString("en-US", {
          ...props.dateFormat,
          timeZone: "UTC",
        }),
        value: newUsers,
      });
    }
    const lastPeriod = newUsersData[newUsersData.length - 2];
    const currentPeriod = newUsersData[newUsersData.length - 1];
    const trend =
      lastPeriod && currentPeriod && lastPeriod.value > 0
        ? (currentPeriod.value - lastPeriod.value) / lastPeriod.value
        : 0;
    return { graphData: newUsersData, trend };
  }, [props.data, props.dateFormat]);
  const isEmpty = useMemo(
    () => graphData.length === 0 || graphData.every((x) => x.value === 0),
    [graphData],
  );

  const uniqueId = useId();

  const chartColor = isEmpty
    ? "hsl(var(--muted-foreground))"
    : "hsl(var(--chart-1))";

  return (
    <section className="relative flex min-h-[320px] flex-col">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div>
          <CardHeading>New Customers </CardHeading>
          <div className="mb-5 flex items-center gap-3">
            <SkeletonContainer
              loadedData={
                isEmpty ? "NA" : graphData[graphData.length - 1]?.value || 0
              }
              skeletonData={100}
              render={(v) => {
                return (
                  <p className="font-semibold text-4xl tracking-tighter">{v}</p>
                );
              }}
            />

            {!isEmpty && (
              <SkeletonContainer
                loadedData={trend}
                className="rounded-2xl"
                skeletonData={1}
                render={(v) => {
                  return <ChangeBadge percent={v} />;
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={graphData || emptyGraphData}>
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

            {graphData && (
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

        {isEmpty && <NoDataOverlay />}
      </div>
    </section>
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
