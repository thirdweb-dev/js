import { defineChain } from "thirdweb";
import { type ChainMetadata, getChainMetadata } from "thirdweb/chains";
import { cn } from "@/lib/utils";
import type { UserOpStats } from "@/types/analytics";
import { BarChart } from "../../../components/Analytics/BarChart";
import { CombinedBarChartCard } from "../../../components/Analytics/CombinedBarChartCard";
import { EmptyAccountAbstractionChartContent } from "../../[project_slug]/(sidebar)/account-abstraction/AccountAbstractionAnalytics/SponsoredTransactionsChartCard";

export async function TotalSponsoredChartCardUI({
  data,
  aggregatedData,
  searchParams,
  className,
  onlyMainnet,
  title,
  description,
}: {
  data: UserOpStats[];
  aggregatedData: UserOpStats[];
  searchParams?: { [key: string]: string | string[] | undefined };
  className?: string;
  onlyMainnet?: boolean;
  title?: string;
  description?: string;
}) {
  const chains = await Promise.all(
    data.map(
      (item) =>
        // eslint-disable-next-line no-restricted-syntax
        item.chainId && getChainMetadata(defineChain(Number(item.chainId))),
    ),
  ).then((chains) => chains.filter((c) => c) as ChainMetadata[]);

  // Process data to combine by date and chain type
  const dateMap = new Map<string, { mainnet: number; testnet: number }>();
  for (const item of data) {
    const chain = chains.find((c) => c.chainId === Number(item.chainId));

    const existing = dateMap.get(item.date) || { mainnet: 0, testnet: 0 };
    if (chain?.testnet) {
      existing.testnet += item.sponsoredUsd;
    } else {
      existing.mainnet += item.sponsoredUsd;
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
      .reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
    testnet: aggregatedData
      .filter(
        (d) => chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
    total: aggregatedData.reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
  };

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

  if (onlyMainnet) {
    const filteredData = timeSeriesData.filter((d) => d.mainnet > 0);
    return (
      <div className={cn("rounded-lg border p-4 lg:p-6", className)}>
        <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
          {title || "Total Sponsored"}
        </h3>
        <p className="text-muted-foreground text-sm"> {description}</p>
        <BarChart
          activeKey="mainnet"
          chartConfig={chartConfig}
          data={filteredData}
          emptyChartContent={<EmptyAccountAbstractionChartContent />}
          isCurrency
        />
      </div>
    );
  }

  return (
    <CombinedBarChartCard
      activeChart={
        (searchParams?.totalSponsored as keyof typeof chartConfig) ?? "mainnet"
      }
      aggregateFn={(_data, key) => processedAggregatedData[key]}
      chartConfig={chartConfig}
      className={className}
      data={timeSeriesData}
      existingQueryParams={searchParams}
      isCurrency
      queryKey="totalSponsored"
      title={title || "Gas Sponsored"}
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
