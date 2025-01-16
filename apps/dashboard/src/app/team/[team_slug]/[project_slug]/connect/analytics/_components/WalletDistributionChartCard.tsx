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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EmptyChartState,
  LoadingChartState,
} from "components/analytics/empty-chart-state";
import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { DocLink } from "components/shared/DocLink";
import { useMemo, useState } from "react";
import { Pie, PieChart } from "recharts";
import type { WalletStats } from "types/analytics";
import {
  formatTickerNumber,
  formatWalletType,
} from "../../../../../../../lib/format-utils";

type ChartToShow = "totalConnections" | "uniqueWalletsConnected";

type ChartData = {
  walletType: string;
  value: number;
  fill: string;
};

const chartLabelToShow: Record<ChartToShow, string> = {
  uniqueWalletsConnected: "Unique Wallets",
  totalConnections: "Total Wallets",
};

export function WalletDistributionChartCard(props: {
  walletStats: WalletStats[];
  isPending: boolean;
}) {
  // show these many top wallets as distinct, and combine the rest as "Others"
  const topWalletsToShow = 10;
  const { walletStats } = props;
  const [chartToShow, setChartToShow] =
    useState<ChartToShow>("totalConnections");
  const chartToShowOptions: ChartToShow[] = [
    "totalConnections",
    "uniqueWalletsConnected",
  ];

  const { chartConfig, chartData, totalConnections, uniqueConnections } =
    useMemo(() => {
      const _chartDataMap: Map<string, number> = new Map();
      const walletTypeToValueMap: Map<string, number> = new Map();

      let _totalConnections = 0;
      let _uniqueConnections = 0;

      for (const stat of walletStats) {
        const { walletType: rawWalletType } = stat;
        const walletType = formatWalletType(rawWalletType);
        const chartData = _chartDataMap.get(walletType);

        _totalConnections += stat.totalConnections;
        _uniqueConnections += stat.uniqueWalletsConnected;
        _chartDataMap.set(walletType, (chartData || 0) + stat[chartToShow]);
        walletTypeToValueMap.set(
          walletType,
          (walletTypeToValueMap.get(walletType) || 0) + stat[chartToShow],
        );
      }

      const walletTypesSortedByValue = Array.from(
        walletTypeToValueMap.entries(),
      )
        .sort((a, b) => b[1] - a[1])
        .map((w) => w[0]);

      const walletTypesToShow = walletTypesSortedByValue.slice(
        0,
        topWalletsToShow,
      );

      const walletTypesToTagAsOthers =
        walletTypesSortedByValue.slice(topWalletsToShow);

      for (const walletType of walletTypesToTagAsOthers) {
        const val = _chartDataMap.get(walletType);
        if (val) {
          const othersVal = _chartDataMap.get("others");
          _chartDataMap.set("others", othersVal ? othersVal + val : val);
        }

        _chartDataMap.delete(walletType);
      }

      const _chartConfig: ChartConfig = {};
      walletTypesToShow.forEach((walletType, i) => {
        _chartConfig[walletType] = {
          label: walletTypesToShow[i],
          color: `hsl(var(--chart-${(i % 10) + 1}))`,
        };
      });

      // Add Others
      _chartConfig.others = {
        label: "Others",
        color: "hsl(var(--muted-foreground))",
      };

      const _chartData: ChartData[] = Array.from(_chartDataMap).map(
        ([walletType, data]) => {
          return {
            walletType,
            value: data,
            fill: _chartConfig[walletType]?.color || "transparent",
          };
        },
      );

      //  sort the data
      _chartData.sort((a, b) => b.value - a.value);

      return {
        chartData: _chartData,
        chartConfig: _chartConfig,
        totalConnections: _totalConnections,
        uniqueConnections: _uniqueConnections,
      };
    }, [walletStats, chartToShow]);

  const disableActions = props.isPending || chartData.length === 0;
  return (
    <div className="relative w-full rounded-lg border border-border bg-card p-4 md:p-6">
      <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
        Wallet Distribution
      </h3>
      <p className="mb-3 text-muted-foreground text-sm">
        Distribution of wallet types used to connect to your app.
      </p>

      {/* Selector */}
      <div className="top-6 right-6 mb-4 grid grid-cols-2 items-center gap-2 md:absolute md:mb-0 md:flex">
        <Select
          onValueChange={(v) => {
            setChartToShow(v as ChartToShow);
          }}
          value={chartToShow}
          disabled={props.isPending || chartData.length === 0}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {chartToShowOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {chartLabelToShow[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ExportToCSVButton
          fileName="Wallet Distribution"
          className="bg-background"
          disabled={disableActions}
          getData={async () => {
            const header = [
              "Wallet",
              `${chartToShow === "totalConnections" ? "Total" : "Unique"} Connections`,
              `Percentage of ${chartToShow === "totalConnections" ? "Total" : "Unique"} Connections`,
            ];
            const rows = chartData.map((d) => {
              return [
                d.walletType,
                d.value.toString(),
                `${((d.value / (chartToShow === "totalConnections" ? totalConnections : uniqueConnections)) * 100).toFixed(2)}%`,
              ];
            });
            return {
              header,
              rows,
            };
          }}
        />
      </div>

      {/* Chart */}
      <ChartContainer
        config={chartConfig}
        className="mt-6 h-[500px] w-full [&_.recharts-pie-label-text]:fill-foreground"
      >
        {props.isPending ? (
          <LoadingChartState />
        ) : chartData.length === 0 ? (
          <EmptyChartState>
            <div className="flex flex-col items-center justify-center">
              <span className="mb-6 text-lg">
                Connect any wallet to your app
              </span>
              <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
                <DocLink
                  link="https://portal.thirdweb.com/typescript/v5/supported-wallets"
                  label="TypeScript"
                  icon={TypeScriptIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/typescript/v5/supported-wallets"
                  label="React"
                  icon={ReactIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/typescript/v5/supported-wallets"
                  label="React Native"
                  icon={ReactIcon}
                />
              </div>
            </div>
          </EmptyChartState>
        ) : (
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  valueFormatter={(v) => {
                    if (typeof v === "number") {
                      const sumValue =
                        chartToShow === "uniqueWalletsConnected"
                          ? uniqueConnections
                          : totalConnections;
                      const percentageValue = ((v / sumValue) * 100).toFixed(2);
                      return `${percentageValue}% - ${formatTickerNumber(v)}`;
                    }
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} className="" />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="walletType"
              innerRadius={60}
              strokeWidth={2}
              stroke="hsl(var(--muted))"
            />
          </PieChart>
        )}
      </ChartContainer>
    </div>
  );
}
