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
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { EmptyChartState, LoadingChartState } from "./EmptyChartState";

type ChartToShow = "uniqueWalletsConnected" | "totalConnections";

type ChartData = Record<string, number> & {
  time: string; // human readable date
};

const chartLabelToShow: Record<ChartToShow, string> = {
  uniqueWalletsConnected: "Unique Wallets",
  totalConnections: "Total Wallets",
};
export function WalletConnectorsChartCard(props: {
  walletStats: WalletStats[];
  isPending: boolean;
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
    const _chartDataMap: Map<string, ChartData> = new Map();

    for (const data of walletStats) {
      const chartData = _chartDataMap.get(data.date);
      const dataKey = data.walletType;

      // if no data for current day - create new entry
      if (!chartData) {
        _chartDataMap.set(data.date, {
          time: format(new Date(data.date), "MMM dd"),
          [data.walletType]: data[chartToShow],
        } as ChartData);
      } else {
        if (dataKey in chartData) {
          chartData[dataKey] += data[chartToShow];
        } else {
          chartData[dataKey] = data[chartToShow];
        }
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

    return {
      chartData: Array.from(_chartDataMap.values()),
      chartConfig: _chartConfig,
    };
  }, [walletStats, chartToShow]);

  const uniqueWalletTypes = Object.keys(chartConfig);
  const disableActions = props.isPending || chartData.length === 0;

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 relative w-full">
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">
        Connected Wallets
      </h3>
      <p className="text-muted-foreground mb-3 text-sm">
        The different types of wallets used to connect to your app each day.
      </p>

      <div className="md:absolute top-6 right-6 mb-4 md:mb-0 md:flex items-center gap-2 grid grid-cols-2">
        <Select
          onValueChange={(v) => {
            setChartToShow(v as ChartToShow);
          }}
          value={chartToShow}
          disabled={disableActions}
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
          className="bg-background"
          fileName="Connect Wallets"
          disabled={disableActions}
          getData={async () => {
            // Shows the number of each type of wallet connected on all dates
            const header = ["Date", ...uniqueWalletTypes];
            const rows = chartData.map((data) => {
              const { time, ...rest } = data;
              return [
                time,
                ...uniqueWalletTypes.map((w) => (rest[w] || 0).toString()),
              ];
            });
            return { header, rows };
          }}
        />
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="w-full h-[400px]">
        {props.isPending ? (
          <LoadingChartState />
        ) : chartData.length === 0 ? (
          <EmptyChartState />
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

            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {uniqueWalletTypes.map((walletType) => {
              return (
                <Bar
                  key={walletType}
                  dataKey={walletType}
                  fill={chartConfig[walletType].color}
                  radius={4}
                  stackId="a"
                  strokeWidth={1.5}
                  className="stroke-muted"
                />
              );
            })}
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
}
