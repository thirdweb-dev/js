"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { DocLink } from "@/components/blocks/DocLink";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { DotNetIcon } from "@/icons/brand-icons/DotNetIcon";
import { ReactIcon } from "@/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "@/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "@/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "@/icons/brand-icons/UnrealIcon";
import type { UserOpStats } from "@/types/analytics";
import { formatTickerNumber } from "@/utils/format-utils";

type ChartData = Record<string, number> & {
  time: string;
};

type MetricType =
  | "sponsoredTransactions"
  | "gasUnits"
  | "avgGasPrice"
  | "costPerGasUnit";

export function GasMetricsChartCard(props: {
  userOpStats: UserOpStats[];
  isPending: boolean;
}) {
  const { userOpStats } = props;
  const topChainsToShow = 10;
  const chainsStore = useAllChainsData();
  const [metricType, setMetricType] = useState<MetricType>(
    "sponsoredTransactions",
  );

  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {};
    const _chartDataMap: Map<string, ChartData> = new Map();
    const chainIdToVolumeMap: Map<string, number> = new Map();

    // for each stat, add it in _chartDataMap
    for (const stat of userOpStats) {
      const chartData = _chartDataMap.get(stat.date);
      const { chainId } = stat;
      const chain = chainsStore.idToChain.get(Number(chainId));
      const chainName = chain?.name || chainId || "Unknown";

      let value: number;
      if (metricType === "sponsoredTransactions") {
        value = stat.successful;
      } else if (metricType === "gasUnits") {
        value = stat.gasUnits;
      } else if (metricType === "avgGasPrice") {
        value = stat.avgGasPrice;
      } else {
        // costPerGasUnit: USD spent per gas unit (helps identify price spike impact)
        value = stat.gasUnits > 0 ? stat.sponsoredUsd / stat.gasUnits : 0;
      }

      // if no data for current day - create new entry
      if (!chartData) {
        _chartDataMap.set(stat.date, {
          time: stat.date,
          [chainName]: value,
        } as ChartData);
      } else {
        chartData[chainName] = (chartData[chainName] || 0) + value;
      }

      chainIdToVolumeMap.set(
        chainName,
        value + (chainIdToVolumeMap.get(chainName) || 0),
      );
    }

    const chainsSorted = Array.from(chainIdToVolumeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((w) => w[0]);

    const chainsToShow = chainsSorted.slice(0, topChainsToShow);
    const chainsToTagAsOthers = chainsSorted.slice(topChainsToShow);

    // replace chainIdsToTagAsOther chainId with "other"
    for (const data of _chartDataMap.values()) {
      for (const chainId in data) {
        if (chainsToTagAsOthers.includes(chainId)) {
          data.others = (data.others || 0) + (data[chainId] || 0);
          delete data[chainId];
        }
      }
    }

    chainsToShow.forEach((chainName, i) => {
      _chartConfig[chainName] = {
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
        label: chainName,
      };
    });

    // Add Other
    if (chainsToTagAsOthers.length > 0) {
      chainsToShow.push("others");
      _chartConfig.others = {
        color: "hsl(var(--muted-foreground))",
        label: "Others",
      };
    }

    return {
      chartConfig: _chartConfig,
      chartData: Array.from(_chartDataMap.values()).sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      }),
    };
  }, [userOpStats, chainsStore, metricType]);

  const uniqueChainIds = Object.keys(chartConfig);
  const disableActions =
    props.isPending ||
    chartData.length === 0 ||
    chartData.every((data) => {
      return Object.entries(data).every(([key, value]) => {
        return key === "time" || value === 0;
      });
    });

  const metricConfig = {
    sponsoredTransactions: {
      title: "Sponsored Transactions",
      description: "Total number of sponsored transactions",
      fileName: "Sponsored Transactions",
      formatter: (value: number) => formatTickerNumber(value),
    },
    gasUnits: {
      title: "Gas Units Consumed",
      description: "Total gas units consumed by sponsored transactions",
      fileName: "Gas Units Consumed",
      formatter: (value: number) => formatTickerNumber(value),
    },
    avgGasPrice: {
      title: "Average Gas Price",
      description: "Average gas price in Gwei for sponsored transactions",
      fileName: "Average Gas Price",
      formatter: (value: number) => {
        // Convert from wei to Gwei
        const gwei = value / 1_000_000_000;
        return `${formatTickerNumber(gwei)} Gwei`;
      },
    },
    costPerGasUnit: {
      title: "Cost per Gas Unit",
      description:
        "USD spent per gas unit - spikes indicate gas price increases",
      fileName: "Cost per Gas Unit",
      formatter: (value: number) => {
        // Show in micro-USD for readability
        return `$${(value * 1_000_000).toFixed(4)}µ`;
      },
    },
  };

  const config =
    metricConfig[metricType as keyof typeof metricConfig] ||
    metricConfig.sponsoredTransactions;

  return (
    <ThirdwebBarChart
      chartClassName="aspect-[1] lg:aspect-[3.5]"
      config={chartConfig}
      customHeader={
        <div className="relative px-6 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
                {config.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {config.description}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setMetricType("sponsoredTransactions")}
                size="sm"
                variant={
                  metricType === "sponsoredTransactions" ? "default" : "outline"
                }
              >
                Transactions
              </Button>
              <Button
                onClick={() => setMetricType("gasUnits")}
                size="sm"
                variant={metricType === "gasUnits" ? "default" : "outline"}
              >
                Gas Units
              </Button>
              <Button
                onClick={() => setMetricType("avgGasPrice")}
                size="sm"
                variant={metricType === "avgGasPrice" ? "default" : "outline"}
              >
                Gas Price
              </Button>
              <Button
                onClick={() => setMetricType("costPerGasUnit")}
                size="sm"
                variant={
                  metricType === "costPerGasUnit" ? "default" : "outline"
                }
              >
                Cost Efficiency
              </Button>
            </div>
          </div>

          <div className="top-6 right-6 mt-4 mb-4 grid grid-cols-2 items-center gap-2 md:absolute md:my-0 md:flex md:mt-10">
            <ExportToCSVButton
              className="bg-background"
              disabled={disableActions}
              fileName={config.fileName}
              getData={async () => {
                const header = ["Date", ...uniqueChainIds];
                const rows = chartData.map((data) => {
                  const { time, ...rest } = data;
                  return [
                    time,
                    ...uniqueChainIds.map((w) => (rest[w] || 0).toString()),
                  ];
                });
                return { header, rows };
              }}
            />
          </div>
        </div>
      }
      data={chartData}
      emptyChartState={<GasMetricsChartCardEmptyChartState />}
      hideLabel={false}
      isPending={props.isPending}
      showLegend
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as number;
          return format(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
      toolTipValueFormatter={(value) => {
        if (typeof value !== "number") {
          return "";
        }
        return config.formatter(value);
      }}
      variant="stacked"
    />
  );
}

function GasMetricsChartCardEmptyChartState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="mb-6 text-lg">Sponsor gas for your users</span>
      <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <DocLink
          icon={TypeScriptIcon}
          label="TypeScript"
          link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
        />
        <DocLink
          icon={ReactIcon}
          label="React"
          link="https://portal.thirdweb.com/react/v5/account-abstraction/get-started"
        />
        <DocLink
          icon={ReactIcon}
          label="React Native"
          link="https://portal.thirdweb.com/react/v5/account-abstraction/get-started"
        />
        <DocLink
          icon={UnityIcon}
          label="Unity"
          link="https://portal.thirdweb.com/unity/v5/wallets/account-abstraction"
        />
        <DocLink
          icon={UnrealIcon}
          label="Unreal Engine"
          link="https://portal.thirdweb.com/unreal-engine/blueprints/smart-wallet"
        />
        <DocLink
          icon={DotNetIcon}
          label=".NET"
          link="https://portal.thirdweb.com/dotnet/wallets/providers/account-abstraction"
        />
      </div>
    </div>
  );
}
