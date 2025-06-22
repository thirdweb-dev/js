"use client";

import { differenceInCalendarDays, format } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Button } from "@/components/ui/button";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";
import {
  useContractEventAnalytics,
  useContractTransactionAnalytics,
  useContractUniqueWalletAnalytics,
} from "../../analytics/utils/hooks";

function getDateKey(date: Date, precision: "day" | "hour") {
  const dayKey = date.toISOString().split("T")[0];
  if (precision === "day") {
    return dayKey;
  }

  const hourKey = date.getHours();
  return `${dayKey}-${hourKey}`;
}

export function ContractAnalyticsOverviewCard(props: {
  contractAddress: string;
  chainId: number;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const [startDate] = useState(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() - 14);
      return date;
    })(),
  );
  const [endDate] = useState(new Date());
  const { data, precision, isPending } = useContractAnalyticsOverview({
    chainId: props.chainId,
    contractAddress: props.contractAddress,
    endDate,
    startDate,
  });

  const analyticsPath = buildContractPagePath({
    chainIdOrSlug: props.chainSlug,
    contractAddress: props.contractAddress,
    projectMeta: props.projectMeta,
    subpath: "/analytics",
  });

  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[3]"
      config={{
        events: {
          color: "hsl(var(--chart-3))",
          label: "Events",
        },
        transactions: {
          color: "hsl(var(--chart-2))",
          label: "Transactions",
        },
        wallets: {
          color: "hsl(var(--chart-1))",
          label: "Unique Wallets",
        },
      }}
      customHeader={
        <div className="flex items-center justify-between gap-4 border-b p-6 py-4">
          <h2 className="font-semibold text-xl tracking-tight">Analytics</h2>
          <Button
            asChild
            className="gap-2 bg-background text-muted-foreground"
            size="sm"
            variant="outline"
          >
            <Link href={analyticsPath}>
              <span>View All</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      }
      data={data || []}
      isPending={isPending}
      showLegend
      toolTipLabelFormatter={toolTipLabelFormatterWithPrecision(precision)}
    />
  );
}

export function useContractAnalyticsOverview(props: {
  chainId: number;
  contractAddress: string;
  startDate: Date;
  endDate: Date;
}) {
  const { chainId, contractAddress, startDate, endDate } = props;
  const wallets = useContractUniqueWalletAnalytics({
    chainId: chainId,
    contractAddress: contractAddress,
    endDate,
    startDate,
  });

  const transactions = useContractTransactionAnalytics({
    chainId: chainId,
    contractAddress: contractAddress,
    endDate,
    startDate,
  });

  const events = useContractEventAnalytics({
    chainId: chainId,
    contractAddress: contractAddress,
    endDate,
    startDate,
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
          events: event?.count || 0,
          time,
          transactions: transaction?.count || 0,
          wallets: wallet?.count || 0,
        };
      }),
      precision,
    };
  }, [wallets.data, transactions.data, events.data, isPending]);

  return {
    data,
    isPending,
    precision,
  };
}

export function toolTipLabelFormatterWithPrecision(precision: "day" | "hour") {
  return function toolTipLabelFormatter(_v: string, item: unknown) {
    if (Array.isArray(item)) {
      const time = item[0].payload.time as number;
      return format(
        new Date(time),
        precision === "day" ? "MMM d, yyyy" : "MMM d, yyyy hh:mm a",
      );
    }
    return undefined;
  };
}
