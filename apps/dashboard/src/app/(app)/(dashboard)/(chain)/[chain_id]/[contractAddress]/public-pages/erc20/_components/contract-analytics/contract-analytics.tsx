"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import {
  useContractEventAnalytics,
  useContractTransactionAnalytics,
  useContractUniqueWalletAnalytics,
} from "data/analytics/hooks";
import { useMemo, useState } from "react";

function getDayKey(date: Date) {
  return date.toISOString().split("T")[0];
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

  const mergedData = useMemo(() => {
    if (isPending) {
      return undefined;
    }

    const time = (wallets.data || transactions.data || events.data || []).map(
      (wallet) => wallet.time,
    );

    return time.map((time) => {
      const wallet = wallets.data?.find(
        (wallet) => getDayKey(wallet.time) === getDayKey(time),
      );
      const transaction = transactions.data?.find(
        (transaction) => getDayKey(transaction.time) === getDayKey(time),
      );
      const event = events.data?.find((event) => {
        return getDayKey(event.time) === getDayKey(time);
      });

      return {
        time,
        wallets: wallet?.count || 0,
        transactions: transaction?.count || 0,
        events: event?.count || 0,
      };
    });
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
        data={mergedData || []}
        isPending={isPending}
        showLegend
        chartClassName="aspect-[1.5] lg:aspect-[3]"
      />
    </div>
  );
}
