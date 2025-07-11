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
    <ThirdwebAreaChart
      chartClassName="aspect-[1.2] lg:aspect-[3]"
      cardContentClassName="px-0 pb-0"
      margin={{
        bottom: 20,
      }}
      header={{
        headerClassName: "p-4 lg:p-6",
        title: "Analytics",
        titleClassName: "font-semibold text-2xl mb-0.5 tracking-tight",
        description:
          "View trends of transactions, events and unique wallets interacting with this contract over time",
      }}
      config={{
        events: {
          color: "hsl(var(--chart-5))",
          label: "Events",
        },
        transactions: {
          color: "hsl(var(--chart-8))",
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
  );
}
