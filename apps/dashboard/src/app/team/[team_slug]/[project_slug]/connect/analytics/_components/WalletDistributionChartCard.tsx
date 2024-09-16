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
import type { WalletStats } from "@3rdweb-sdk/react/hooks/useApi";
import { useMemo, useState } from "react";
import { Pie, PieChart } from "recharts";
import { EmptyChartState, LoadingChartState } from "./EmptyChartState";

type ChartToShow = "unique" | "total";

type ChartData = {
  walletType: string;
  totalWallets: number;
  uniqueWallets: number;
  fill: string;
};

const chartLabelToShow: Record<ChartToShow, string> = {
  unique: "Unique Wallets",
  total: "Total Wallets",
};

export function WalletDistributionChartCard(props: {
  walletStats: WalletStats[];
  isLoading: boolean;
}) {
  const { walletStats } = props;
  const [chartToShow, setChartToShow] = useState<ChartToShow>("total");
  const chartToShowOptions: ChartToShow[] = ["total", "unique"];

  const { chartConfig, chartData, totalConnections, uniqueConnections } =
    useMemo(() => {
      const _chartConfig: ChartConfig = {};
      const _chartDataMap: Map<
        string,
        {
          total: number;
          unique: number;
        }
      > = new Map();

      let _totalConnections = 0;
      let _uniqueConnections = 0;

      for (const data of walletStats) {
        const chartData = _chartDataMap.get(data.walletType);

        _totalConnections += data.totalConnections;
        _uniqueConnections += data.uniqueWalletsConnected;

        // if no data for current day - create new entry
        if (!chartData) {
          _chartDataMap.set(data.walletType, {
            total: data.totalConnections,
            unique: data.uniqueWalletsConnected,
          });
        } else {
          _chartDataMap.set(data.walletType, {
            total: chartData.total + data.totalConnections,
            unique: chartData.unique + data.uniqueWalletsConnected,
          });
        }
      }

      // create chart config for each wallet type and assign a unique color, start from 0hue to 360hue
      const uniqueWalletTypes = Array.from(
        new Set(walletStats.map((data) => data.walletType)),
      );

      const hueIncrement = 360 / uniqueWalletTypes.length;

      for (let i = 0; i < uniqueWalletTypes.length; i++) {
        const walletType = uniqueWalletTypes[i];
        _chartConfig[walletType] = {
          label: uniqueWalletTypes[i],
          color: `hsl(${i + hueIncrement * i}deg, var(--chart-saturation), var(--chart-lightness))`,
        };
      }

      const _chartData: ChartData[] = Array.from(_chartDataMap).map(
        ([walletType, data]) => {
          return {
            walletType,
            totalWallets: data.total,
            uniqueWallets: data.unique,
            fill: _chartConfig[walletType].color || "transparent",
          };
        },
      );

      //  sort the data
      _chartData.sort((a, b) => b.totalWallets - a.totalWallets);

      return {
        chartData: _chartData,
        chartConfig: _chartConfig,
        totalConnections: _totalConnections,
        uniqueConnections: _uniqueConnections,
      };
    }, [walletStats]);

  const disableActions = props.isLoading || chartData.length === 0;
  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 relative w-full">
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">
        Wallet Distribution
      </h3>
      <p className="text-muted-foreground mb-3 text-sm">
        Distribution of wallet types used to connect to your app.
      </p>

      {/* Selector */}
      <div className="md:absolute top-6 right-6 mb-4 md:mb-0 md:flex items-center gap-2 grid grid-cols-2">
        <Select
          onValueChange={(v) => {
            setChartToShow(v as ChartToShow);
          }}
          value={chartToShow}
          disabled={props.isLoading || chartData.length === 0}
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
              "Total Connections",
              "Unique Connections",
              "Percentage of Total connections",
              "Percentage of Unique connections",
            ];
            const rows = chartData.map((d) => {
              return [
                // name
                d.walletType,
                // total connections
                d.totalWallets.toString(),
                // unique connections
                d.uniqueWallets.toString(),
                // percentage of total connections
                `${((d.totalWallets / totalConnections) * 100).toFixed(2)}%`,
                // percentage of unique connections
                `${((d.uniqueWallets / uniqueConnections) * 100).toFixed(2)}%`,
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
        className="w-full h-[500px] [&_.recharts-pie-label-text]:fill-foreground mt-6"
      >
        {props.isLoading ? (
          <LoadingChartState />
        ) : chartData.length === 0 ? (
          <EmptyChartState />
        ) : (
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  valueFormatter={(v) => {
                    if (typeof v === "number") {
                      const sumValue =
                        chartToShow === "unique"
                          ? uniqueConnections
                          : totalConnections;
                      const percentageValue = ((v / sumValue) * 100).toFixed(2);
                      return `${percentageValue}% - ${v}`;
                    }
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} className="" />
            <Pie
              data={chartData}
              dataKey={
                chartToShow === "unique" ? "uniqueWallets" : "totalWallets"
              }
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
