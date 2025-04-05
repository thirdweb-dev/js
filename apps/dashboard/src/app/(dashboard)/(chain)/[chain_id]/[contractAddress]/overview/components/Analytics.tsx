"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Button } from "@/components/ui/button";
import {
  useContractEventAnalytics,
  useContractTransactionAnalytics,
  useContractUniqueWalletAnalytics,
} from "data/analytics/hooks";
import { useTrack } from "hooks/analytics/useTrack";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

function getDayKey(date: Date) {
  return date.toISOString().split("T")[0];
}

export function ContractAnalyticsOverviewCard(props: {
  contractAddress: string;
  chainId: number;
  trackingCategory: string;
  chainSlug: string;
}) {
  const trackEvent = useTrack();
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
    <ThirdwebAreaChart
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
      customHeader={
        <div className="flex items-center justify-between gap-4 border-b p-6 py-4">
          <h2 className="font-semibold text-xl tracking-tight">Analytics</h2>
          <Button
            asChild
            className="gap-2 bg-background text-muted-foreground"
            size="sm"
            variant="outline"
            onClick={() => {
              trackEvent({
                category: props.trackingCategory,
                action: "click",
                label: "view_all_analytics",
              });
            }}
          >
            <Link
              href={`/${props.chainSlug}/${props.contractAddress}/analytics`}
            >
              <span>View All</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      }
    />
  );
}
