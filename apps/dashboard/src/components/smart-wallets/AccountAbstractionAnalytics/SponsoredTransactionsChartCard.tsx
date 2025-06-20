"use client";

import { DotNetIcon } from "components/icons/brand-icons/DotNetIcon";
import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "components/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "components/icons/brand-icons/UnrealIcon";
import { DocLink } from "components/shared/DocLink";
import { format } from "date-fns";
import { useAllChainsData } from "hooks/chains/allChains";
import { useMemo } from "react";
import type { UserOpStats } from "types/analytics";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import type { ChartConfig } from "@/components/ui/chart";
import { formatTickerNumber } from "../../../lib/format-utils";

type ChartData = Record<string, number> & {
  time: string;
};

export function SponsoredTransactionsChartCard(props: {
  userOpStats: UserOpStats[];
  isPending: boolean;
}) {
  const { userOpStats } = props;
  const topChainsToShow = 10;
  const chainsStore = useAllChainsData();

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
      // if no data for current day - create new entry
      if (!chartData) {
        _chartDataMap.set(stat.date, {
          time: stat.date,
          [chainName]: stat.successful,
        } as ChartData);
      } else {
        chartData[chainName] = (chartData[chainName] || 0) + stat.successful;
      }

      chainIdToVolumeMap.set(
        chainName,
        stat.successful + (chainIdToVolumeMap.get(chainName) || 0),
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
    chainsToShow.push("others");
    _chartConfig.others = {
      color: "hsl(var(--muted-foreground))",
      label: "Others",
    };

    return {
      chartConfig: _chartConfig,
      chartData: Array.from(_chartDataMap.values()),
    };
  }, [userOpStats, chainsStore]);

  const uniqueChainIds = Object.keys(chartConfig);
  const disableActions =
    props.isPending ||
    chartData.length === 0 ||
    chartData.every((data) => data.transactions === 0);

  return (
    <ThirdwebBarChart
      chartClassName="aspect-[1] lg:aspect-[3]"
      config={chartConfig}
      customHeader={
        <div className="relative px-6 pt-6">
          <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
            Sponsored Transactions
          </h3>
          <p className="text-muted-foreground text-sm">
            Total number of sponsored transactions
          </p>

          <div className="top-6 right-6 mt-4 mb-8 grid grid-cols-2 items-center gap-2 md:absolute md:my-0 md:flex">
            <ExportToCSVButton
              className="bg-background"
              disabled={disableActions}
              fileName="Sponsored Transactions"
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
      emptyChartState={<EmptyAccountAbstractionChartContent />}
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
      toolTipValueFormatter={(value) => formatTickerNumber(Number(value))}
    />
  );
}

export function EmptyAccountAbstractionChartContent() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <span className="mb-6 text-center text-lg">
        Send your first sponsored transaction
      </span>
      <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <DocLink
          icon={TypeScriptIcon}
          label="TypeScript"
          link="https://portal.thirdweb.com/typescript/v5/account-abstraction/batching-transactions"
        />
        <DocLink
          icon={ReactIcon}
          label="React"
          link="https://portal.thirdweb.com/react/v5/account-abstraction/batching-transactions"
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
