"use client";

import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  EmptyChartState,
  LoadingChartState,
} from "components/analytics/empty-chart-state";
import { DotNetIcon } from "components/icons/brand-icons/DotNetIcon";
import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "components/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "components/icons/brand-icons/UnrealIcon";
import { DocLink } from "components/shared/DocLink";
import { format } from "date-fns";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { UserOpStats } from "types/analytics";
import { useAllChainsData } from "../../../hooks/chains/allChains";
import { toUSD } from "../../../utils/number";

type ChartData = Record<string, number> & {
  time: string; // human readable date
};

export function TotalSponsoredChartCard(props: {
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

      // if no data for current day - create new entry
      if (!chartData) {
        _chartDataMap.set(stat.date, {
          time: format(new Date(stat.date), "MMM dd"),
          [chain?.name || chainId || "Unknown"]: stat.sponsoredUsd,
        } as ChartData);
      } else {
        chartData[chain?.name || chainId || "Unknown"] =
          (chartData[chain?.name || chainId || "Unknown"] || 0) +
          stat.sponsoredUsd;
      }

      chainIdToVolumeMap.set(
        chain?.name || chainId || "Unknown",
        stat.sponsoredUsd + (chainIdToVolumeMap.get(chainId || "Unknown") || 0),
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

    chainsToShow.forEach((walletType, i) => {
      _chartConfig[walletType] = {
        label: chainsToShow[i],
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
      };
    });

    // Add Other
    chainsToShow.push("others");
    _chartConfig.others = {
      label: "Others",
      color: "hsl(var(--muted-foreground))",
    };

    return {
      chartData: Array.from(_chartDataMap.values()),
      chartConfig: _chartConfig,
    };
  }, [userOpStats, chainsStore]);

  const uniqueChainIds = Object.keys(chartConfig);
  const disableActions =
    props.isPending ||
    chartData.length === 0 ||
    chartData.every((data) => data.sponsoredUsd === 0);

  return (
    <div className="relative w-full rounded-lg border border-border bg-card p-4 md:p-6">
      <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
        Gas Sponsored
      </h3>
      <p className="mb-3 text-muted-foreground text-sm">
        The total amount of gas sponsored in USD.
      </p>

      <div className="top-6 right-6 mb-4 grid grid-cols-2 items-center gap-2 md:absolute md:mb-0 md:flex">
        <ExportToCSVButton
          className="bg-background"
          fileName="Gas Sponsored"
          disabled={disableActions}
          getData={async () => {
            // Shows the number of each type of wallet connected on all dates
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

      {/* Chart */}
      <ChartContainer
        config={chartConfig}
        className="h-[250px] w-full md:h-[350px]"
      >
        {props.isPending ? (
          <LoadingChartState />
        ) : chartData.length === 0 ||
          chartData.every((data) => data.sponsoredUsd === 0) ? (
          <EmptyChartState>
            <div className="flex flex-col items-center justify-center">
              <span className="mb-6 text-lg">Sponsor gas for your users</span>
              <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
                <DocLink
                  link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
                  label="TypeScript"
                  icon={TypeScriptIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/react/v5/account-abstraction/get-started"
                  label="React"
                  icon={ReactIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/react/v5/account-abstraction/get-started"
                  label="React Native"
                  icon={ReactIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/unity/v5/wallets/account-abstraction"
                  label="Unity"
                  icon={UnityIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/unreal-engine/blueprints/smart-wallet"
                  label="Unreal Engine"
                  icon={UnrealIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/dotnet/wallets/providers/account-abstraction"
                  label=".NET"
                  icon={DotNetIcon}
                />
              </div>
            </div>
          </EmptyChartState>
        ) : (
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <YAxis
              dataKey={(data) => {
                return Object.entries(data)
                  .filter(([key]) => key !== "time")
                  .map(([, value]) => value)
                  .reduce((acc, current) => Number(acc) + Number(current), 0);
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => toUSD(value)}
            />

            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  valueFormatter={(value) => {
                    // typeguard
                    if (typeof value !== "number") {
                      return "";
                    }

                    return toUSD(value);
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {uniqueChainIds.map((chainId) => {
              return (
                <Bar
                  key={chainId}
                  dataKey={chainId}
                  fill={chartConfig[chainId]?.color}
                  radius={4}
                  stackId="a"
                  strokeWidth={1}
                  className="stroke-background"
                />
              );
            })}
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
}
