import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import {} from "@/components/ui/card";
import {} from "@/components/ui/table";
import { format } from "date-fns";
import {} from "lucide-react";
import type { ChainMetadata } from "thirdweb/chains";
import type { TransactionDetails } from "../hooks/useGetRecentTransactions";

interface TimelineOverviewProps {
  transactions: TransactionDetails[];
  isLoading: boolean;
}

// function parseTransactions(args: {
//   address: string;
//   transactions: TransactionDetails[];
// }) {
//   const { address, transactions } = args;
//   const addressLower = address.toLowerCase();

//   const numTransactionsDaily: Record<string, number> = {};
//   const numContractsDaily: Record<string, number> = {};
//   const topContracts: Record<string, number> = {};

//   for (const transaction of transactions) {
//     const date = format(transaction.date, "yyyy-MM-dd");
//     numTransactionsDaily[date] = (numTransactionsDaily[date] || 0) + 1;
//     numContractsDaily[date] = (numContractsDaily[date] || 0) + 1;

//     if (transaction.from === addressLower) {
//       topContracts[transaction.from] =
//         (topContracts[transaction.from] || 0) + 1;
//     }
//   }

//   return transactions.reduce(
//     (acc, tx) => {
//       const date = format(tx.date, "yyyy-MM-dd");
//       acc[date] = (acc[date] || 0) + 1;
//       return acc;
//     },
//     {} as Record<string, number>,
//   );
// }

export function TimelineOverview({
  transactions,
  isLoading,
}: TimelineOverviewProps) {
  // Process transactions into daily counts
  const data = (() => {
    const time = transactions.map((tx) => tx.date);

    return time.map((time) => {
      const tx = transactions.find((tx) => tx.date === time);
      return {
        time,
        total: tx ? 1 : 0,
      };
    });

    // Sum transactions by day.
    // const txDates = transactions.reduce(
    //   (acc, tx) => {
    //     const date = format(tx.date, "yyyy-MM-dd");
    //     const existingEntry = acc.find((entry) => entry.date === date);
    //     if (existingEntry) {
    //       existingEntry.total += 1;
    //     } else {
    //       acc.push({ date, total: 1 });
    //     }
    //     return acc;
    //   },
    //   [] as { date: string; total: number }[],
    // );
    // return txDates;
    // console.log("[DEBUG] txDates:", txDates);

    // // Get min and max dates.
    // const dates = txDates.map((d) => new Date(d.date));
    // const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    // const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // // Create array of all dates between min and max
    // const allDates: { date: string; total: number }[] = [];
    // const currentDate = new Date(minDate);
    // while (currentDate <= maxDate) {
    //   const dateStr = format(currentDate, "yyyy-MM-dd");
    //   const existingDate = txDates.find((d) => d.date === dateStr);
    //   allDates.push({
    //     date: dateStr,
    //     total: existingDate?.total || 0,
    //   });
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }

    // return allDates;
  })();

  return (
    <ThirdwebAreaChart
      chartConfig={{
        total: {
          label: "Transactions",
          color: "hsl(var(--chart-1))",
        },
      }}
      data={data || []}
      isPending={isLoading}
      showLegend
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      // activeKey="total"
      // emptyChartContent={<>NO CONTENT</>}
    />
  );
}
