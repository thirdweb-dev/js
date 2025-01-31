import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import type { TransactionDetails } from "../hooks/useGetRecentTransactions";

interface TimelineOverviewProps {
  transactions: TransactionDetails[];
  isLoading: boolean;
}

function getDayKey(date: Date) {
  return date.toDateString().split("T")[0];
}

export function TimelineOverview({
  transactions,
  isLoading,
}: TimelineOverviewProps) {
  const aggResults = transactions.reduce(
    (
      agg: {
        [key: string]: {
          time: Date;
          transactions: number;
          wallets: Set<string>;
        };
      },
      val: TransactionDetails,
    ) => {
      const day = getDayKey(val.date);
      if (!day) return agg;
      if (agg[day] === undefined) {
        agg[day] = {
          time: val.date,
          transactions: 1,
          wallets: new Set([val.to as string]),
        };
      } else {
        agg[day] = {
          time: val.date,
          transactions: agg[day].transactions + 1,
          wallets: agg[day].wallets.add(val.to as string),
        };
      }
      return agg;
    },
    {},
  );

  const data = Object.values(aggResults)
    .map((val) => {
      return {
        time: val.time,
        transactions: val.transactions,
        wallets: val.wallets.size,
      };
    })
    .sort((a, b) => a.time.getTime() - b.time.getTime());
  return (
    <ThirdwebAreaChart
      config={{
        transactions: {
          label: "Transactions",
          color: "hsl(var(--chart-1))",
        },
        wallets: {
          label: "Unique Wallets",
          color: "hsl(var(--chart-2))",
        },
      }}
      data={data || []}
      isPending={isLoading}
      showLegend
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
    />
  );
}
