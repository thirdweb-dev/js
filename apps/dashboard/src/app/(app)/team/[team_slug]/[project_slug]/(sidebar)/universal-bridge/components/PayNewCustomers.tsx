"use client";
import { useId, useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { SkeletonContainer } from "@/components/ui/skeleton";
import type { UniversalBridgeWalletStats } from "@/types/analytics";
import { CardHeading, chartHeight, NoDataOverlay } from "./common";

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
  const { graphData } = useMemo(() => {
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
    return { graphData: newUsersData };
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
              render={(v) => {
                return (
                  <p className="font-semibold text-4xl tracking-tighter">{v}</p>
                );
              }}
              skeletonData={100}
            />
          </div>
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        <ResponsiveContainer height={chartHeight} width="100%">
          <AreaChart data={graphData || emptyGraphData}>
            <defs>
              <linearGradient id={uniqueId} x1="0" x2="0" y1="0" y2="1">
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
                      New Customers: {payload?.value}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              dataKey="value"
              fill={`url(#${uniqueId})`}
              fillOpacity={1}
              stroke={chartColor}
              strokeLinecap="round"
              strokeWidth={2}
              type="monotone"
            />

            {graphData && (
              <XAxis
                axisLine={false}
                className="mt-5 font-sans text-xs"
                dataKey="date"
                dy={12}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
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
      date: date.toISOString(),
      value: x,
    };
  },
);
