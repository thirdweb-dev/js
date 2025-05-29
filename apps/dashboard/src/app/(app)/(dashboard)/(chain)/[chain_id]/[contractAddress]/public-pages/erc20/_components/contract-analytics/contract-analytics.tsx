"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import {
  useContractEventAnalytics,
  useContractTransactionAnalytics,
  useContractUniqueWalletAnalytics,
} from "data/analytics/hooks";
import { differenceInCalendarDays, formatDate } from "date-fns";
import { useMemo, useState } from "react";

function getDateKey(date: Date, precision: "day" | "hour") {
  const dayKey = date.toISOString().split("T")[0];
  if (precision === "day") {
    return dayKey;
  }

  const hourKey = date.getHours();
  return `${dayKey}-${hourKey}`;
}

export function ContractAnalyticsOverview(props: {
  contractAddress: string;
  chainId: number;
  chainSlug: string;
}) {
  const [startDate] = useState(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() - 14);
      return date;
    })(),
  );
  const [endDate] = useState(new Date());

  const wallets = useContractUniqueWalletAnalytics({
    chainId: props.chainId,
    contractAddress: props.contractAddress,
    startDate,
    endDate,
  });

  const transactions = useContractTransactionAnalytics({
    chainId: props.chainId,
    contractAddress: props.contractAddress,
    startDate,
    endDate,
  });

  const events = useContractEventAnalytics({
    chainId: props.chainId,
    contractAddress: props.contractAddress,
    startDate,
    endDate,
  });

  const isPending =
    wallets.isPending || transactions.isPending || events.isPending;

  const { data, precision } = useMemo(() => {
    if (isPending) {
      return {
        data: undefined,
        precision: "day" as const,
      };
    }

    const time = (wallets.data || transactions.data || events.data || []).map(
      (wallet) => wallet.time,
    );

    // if the time difference between the first and last time is less than 3 days - use hour precision
    const firstTime = time[0];
    const lastTime = time[time.length - 1];
    const timeDiff =
      firstTime && lastTime
        ? differenceInCalendarDays(lastTime, firstTime)
        : undefined;

    const precision: "day" | "hour" = !timeDiff
      ? "hour"
      : timeDiff < 3
        ? "hour"
        : "day";

    return {
      data: time.map((time) => {
        const wallet = wallets.data?.find(
          (wallet) =>
            getDateKey(wallet.time, precision) === getDateKey(time, precision),
        );
        const transaction = transactions.data?.find(
          (transaction) =>
            getDateKey(transaction.time, precision) ===
            getDateKey(time, precision),
        );

        const event = events.data?.find((event) => {
          return (
            getDateKey(event.time, precision) === getDateKey(time, precision)
          );
        });

        return {
          time,
          wallets: wallet?.count || 0,
          transactions: transaction?.count || 0,
          events: event?.count || 0,
        };
      }),
      precision,
    };
  }, [wallets.data, transactions.data, events.data, isPending]);

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl tracking-tight">Analytics</h2>
        <p className="mb-3 text-muted-foreground text-sm">
          View trends in unique wallets, transactions, and events over time for
          this contract
        </p>
      </div>
      <ThirdwebAreaChart
        className="border-none bg-background p-0"
        cardContentClassName="p-0"
        config={{
          wallets: {
            label: "Unique Wallets",
            color: "hsl(var(--chart-1))",
          },
          transactions: {
            label: "Transactions",
            color: "hsl(var(--chart-2))",
          },
          events: {
            label: "Events",
            color: "hsl(var(--chart-3))",
          },
        }}
        data={data || []}
        isPending={isPending}
        showLegend
        hideLabel={false}
        chartClassName="aspect-[1.5] lg:aspect-[3]"
        toolTipLabelFormatter={toolTipLabelFormatterWithPrecision(precision)}
      />
    </div>
  );
}

function toolTipLabelFormatterWithPrecision(precision: "day" | "hour") {
  return function toolTipLabelFormatter(_v: string, item: unknown) {
    if (Array.isArray(item)) {
      const time = item[0].payload.time as number;
      return formatDate(
        new Date(time),
        precision === "day" ? "MMM d, yyyy" : "MMM d, yyyy hh:mm a",
      );
    }
    return undefined;
  };
}
