"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import {} from "data/analytics/hooks";
import { useState } from "react";
import {
  toolTipLabelFormatterWithPrecision,
  useContractAnalyticsOverview,
} from "../../../../overview/components/Analytics";

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

  const { data, precision, isPending } = useContractAnalyticsOverview({
    chainId: props.chainId,
    contractAddress: props.contractAddress,
    startDate,
    endDate,
  });

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
