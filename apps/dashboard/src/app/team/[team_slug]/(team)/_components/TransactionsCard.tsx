import { cn } from "@/lib/utils";
import { defineChain } from "thirdweb";
import { type ChainMetadata, getChainMetadata } from "thirdweb/chains";
import type { TransactionStats } from "types/analytics";
import { EmptyAccountAbstractionChartContent } from "../../../../../components/smart-wallets/AccountAbstractionAnalytics/SponsoredTransactionsChartCard";
import { BarChart } from "../../../components/Analytics/BarChart";
import { CombinedBarChartCard } from "../../../components/Analytics/CombinedBarChartCard";

export async function TransactionsChartCardUI({
  data,
  aggregatedData,
  searchParams,
  className,
  onlyMainnet,
  title,
  description,
}: {
  data: TransactionStats[];
  aggregatedData: TransactionStats[];
  searchParams?: { [key: string]: string | string[] | undefined };
  className?: string;
  onlyMainnet?: boolean;
  title?: string;
  description?: string;
}) {
  const uniqueChainIds = [
    ...new Set(data.map((item) => item.chainId).filter(Boolean)),
  ];
  const chains = await Promise.all(
    uniqueChainIds.map((chainId) =>
      // eslint-disable-next-line no-restricted-syntax
      getChainMetadata(defineChain(Number(chainId))).catch(() => undefined),
    ),
  ).then((chains) => chains.filter((c) => c) as ChainMetadata[]);

  // Process data to combine by date and chain type
  const dateMap = new Map<string, { mainnet: number; testnet: number }>();
  for (const item of data) {
    const chain = chains.find((c) => c.chainId === Number(item.chainId));

    const existing = dateMap.get(item.date) || { mainnet: 0, testnet: 0 };
    if (chain?.testnet) {
      existing.testnet += item.count;
    } else {
      existing.mainnet += item.count;
    }
    dateMap.set(item.date, existing);
  }

  // Convert to array and sort by date
  const timeSeriesData = Array.from(dateMap.entries())
    .map(([date, values]) => ({
      date,
      mainnet: values.mainnet,
      testnet: values.testnet,
      total: values.mainnet + values.testnet,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const processedAggregatedData = {
    mainnet: aggregatedData
      .filter(
        (d) => !chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.count, 0),
    testnet: aggregatedData
      .filter(
        (d) => chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.count, 0),
    total: aggregatedData.reduce((acc, curr) => acc + curr.count, 0),
  };

  const chartConfig = {
    mainnet: {
      label: "Mainnet Chains",
      color: "hsl(var(--chart-1))",
    },
    testnet: {
      label: "Testnet Chains",
      color: "hsl(var(--chart-2))",
    },
    total: {
      label: "All Chains",
      color: "hsl(var(--chart-3))",
    },
  };

  if (onlyMainnet) {
    const filteredData = timeSeriesData.filter((d) => d.mainnet > 0);
    return (
      <div className={cn("rounded-lg border p-4 lg:p-6", className)}>
        <h3 className="mb-1 font-semibold text-xl tracking-tight">
          {title || "Transactions"}
        </h3>
        <p className="text-muted-foreground"> {description}</p>
        <BarChart
          chartConfig={chartConfig}
          data={filteredData}
          activeKey="mainnet"
          emptyChartContent={<EmptyAccountAbstractionChartContent />}
        />
      </div>
    );
  }

  return (
    <CombinedBarChartCard
      title={title || "Transactions"}
      chartConfig={chartConfig}
      data={timeSeriesData}
      activeChart={
        (searchParams?.client_transactions as keyof typeof chartConfig) ??
        "mainnet"
      }
      queryKey="client_transactions"
      existingQueryParams={searchParams}
      aggregateFn={(_data, key) => processedAggregatedData[key]}
      className={className}
      // Get the trend from the last two COMPLETE periods
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 3
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[data.length - 3]?.[key] as number) ?? 0) -
            1
          : undefined
      }
    />
  );
}
