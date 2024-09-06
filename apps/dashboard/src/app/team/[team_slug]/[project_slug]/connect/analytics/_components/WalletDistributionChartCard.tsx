"use client";

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

type ChartToShow = "uniqueWalletsConnected" | "totalConnections";

type ChartData = {
  walletType: string;
  totalWallets: number;
  fill: string;
};

const chartLabelToShow: Record<ChartToShow, string> = {
  uniqueWalletsConnected: "Unique Wallets",
  totalConnections: "Total Wallets",
};

export function WalletDistributionChartCard(props: {
  walletStats: WalletStats[];
  isLoading: boolean;
}) {
  const { walletStats } = props;
  const [chartToShow, setChartToShow] = useState<ChartToShow>(
    "uniqueWalletsConnected",
  );
  const chartToShowOptions: ChartToShow[] = [
    "uniqueWalletsConnected",
    "totalConnections",
  ];

  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {};
    const _chartDataMap: Map<string, number> = new Map();

    for (const data of walletStats) {
      const chartData = _chartDataMap.get(data.walletType);

      // if no data for current day - create new entry
      if (!chartData) {
        _chartDataMap.set(data.walletType, data[chartToShow]);
      } else {
        _chartDataMap.set(data.walletType, chartData + data[chartToShow]);
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
      ([walletType, totalWallets]) => {
        return {
          walletType,
          totalWallets,
          fill: _chartConfig[walletType].color || "transparent",
        };
      },
    );

    //  sort the data
    _chartData.sort((a, b) => b.totalWallets - a.totalWallets);

    return {
      chartData: _chartData,
      chartConfig: _chartConfig,
    };
  }, [walletStats, chartToShow]);

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 relative w-full">
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">
        Wallet Distribution
      </h3>
      <p className="text-muted-foreground mb-3 text-sm">
        Distribution of wallet types used to connect to your app.
      </p>

      {/* Selector */}
      <Select
        onValueChange={(v) => {
          setChartToShow(v as ChartToShow);
        }}
        value={chartToShow}
        disabled={props.isLoading || chartData.length === 0}
      >
        <SelectTrigger className="md:w-[180px] md:absolute top-6 right-6 mb-4 md:mb-0">
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} className="" />
            <Pie
              data={chartData}
              dataKey="totalWallets"
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
