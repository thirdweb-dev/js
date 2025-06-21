"use client";

import { useState } from "react";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
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
    endDate,
    startDate,
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
        cardContentClassName="p-0"
        chartClassName="aspect-[1.5] lg:aspect-[3]"
        className="border-none bg-background p-0"
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
        data={data || []}
        hideLabel={false}
        isPending={isPending}
        showLegend
        toolTipLabelFormatter={toolTipLabelFormatterWithPrecision(precision)}
      />
    </div>
  );
}
