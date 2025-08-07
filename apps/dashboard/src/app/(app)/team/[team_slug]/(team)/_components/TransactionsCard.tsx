"use client";
import { useSetResponsiveSearchParams } from "responsive-rsc";
import type { ChainMetadata } from "thirdweb/chains";
import { cn } from "@/lib/utils";
import type { TransactionStats } from "@/types/analytics";
import { BarChart } from "../../../components/Analytics/BarChart";
import { CombinedBarChartCard } from "../../../components/Analytics/CombinedBarChartCard";
import { EmptyAccountAbstractionChartContent } from "../../[project_slug]/(sidebar)/account-abstraction/AccountAbstractionAnalytics/SponsoredTransactionsChartCard";

const chartConfig = {
  mainnet: {
    color: "hsl(var(--chart-1))",
    label: "Mainnet Chains",
  },
  testnet: {
    color: "hsl(var(--chart-2))",
    label: "Testnet Chains",
  },
  total: {
    color: "hsl(var(--chart-3))",
    label: "All Chains",
  },
};

export function TransactionsChartCardUI({
  data,
  className,
  onlyMainnet,
  title,
  description,
  selectedChart,
  selectedChartQueryParam,
  chains,
  processedAggregatedData,
}: {
  data: TransactionStats[];
  className?: string;
  onlyMainnet?: boolean;
  title?: string;
  selectedChartQueryParam: string;
  selectedChart: string | undefined;
  description?: string;
  chains: ChainMetadata[];
  processedAggregatedData: {
    mainnet: number;
    testnet: number;
    total: number;
  };
}) {
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

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

  if (onlyMainnet) {
    const filteredData = timeSeriesData.filter((d) => d.mainnet > 0);
    return (
      <div className={cn("rounded-lg border p-4 lg:p-6", className)}>
        <h3 className="mb-1 font-semibold text-xl tracking-tight">
          {title || "Transactions"}
        </h3>
        <p className="text-muted-foreground"> {description}</p>
        <BarChart
          activeKey="mainnet"
          chartConfig={chartConfig}
          data={filteredData}
          emptyChartContent={<EmptyAccountAbstractionChartContent />}
        />
      </div>
    );
  }

  return (
    <CombinedBarChartCard
      activeChart={
        selectedChart && selectedChart in chartConfig
          ? (selectedChart as keyof typeof chartConfig)
          : "mainnet"
      }
      aggregateFn={(_data, key) => processedAggregatedData[key]}
      chartConfig={chartConfig}
      className={className}
      onSelect={(key) => {
        setResponsiveSearchParams((v) => {
          return {
            ...v,
            [selectedChartQueryParam]: key,
          };
        });
      }}
      data={timeSeriesData}
      title={title || "Transactions"}
      // Get the trend from the last two COMPLETE periods
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 2
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[0]?.[key] as number) ?? 0) -
            1
          : undefined
      }
    />
  );
}
