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
  // show top 10 wallets as distinct, and combine the rest as "Others"
  const topWalletsToShow = 10;
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
    const walletTypeToValueMap: Map<string, number> = new Map();
    // for each stat, add it in _chartDataMap
    for (const stat of walletStats) {
      const chartData = _chartDataMap.get(stat.date);
      const { walletType } = stat;

      // if no data for current day - create new entry
      if (!chartData) {
        _chartDataMap.set(stat.date, {
          time: format(new Date(stat.date), "MMM dd"),
          [walletType]: stat[chartToShow],
        } as ChartData);
      } else {
        chartData[walletType] =
          (chartData[walletType] || 0) + stat[chartToShow];
      }

      walletTypeToValueMap.set(
        walletType,
        stat[chartToShow] + (walletTypeToValueMap.get(walletType) || 0),
      );
    }

    const walletTypesSorted = Array.from(walletTypeToValueMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((w) => w[0]);

    const walletTypesToShow = walletTypesSorted.slice(0, topWalletsToShow);
    const walletTypesToTagAsOthers = walletTypesSorted.slice(topWalletsToShow);

    // replace walletTypesToTagAsOthers walletType with "other"
    for (const data of _chartDataMap.values()) {
      for (const walletType in data) {
        if (walletTypesToTagAsOthers.includes(walletType)) {
          data.others = (data.others || 0) + (data[walletType] || 0);
          delete data[walletType];
        }
      }
    }

    walletTypesToShow.forEach((walletType, i) => {
      _chartConfig[walletType] = {
        label: walletTypesToShow[i],
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
      };
    });

    // Add Other
    walletTypesToShow.push("others");
    _chartConfig.others = {
      label: "Others",
      color: "hsl(var(--muted-foreground))",
    };

    return {
      chartData: Array.from(_chartDataMap.values()),
      chartConfig: _chartConfig,
    };
  }, [walletStats, chartToShow]);

  const uniqueWalletTypes = Object.keys(chartConfig);
  const disableActions = props.isPending || chartData.length === 0;

  return (
    <div className="relative w-full rounded-lg border border-border bg-muted/50 p-4 md:p-6">
      <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
        Connected Wallets
      </h3>
      <p className="mb-3 text-muted-foreground text-sm">
        The different types of wallets used to connect to your app each day.
      </p>

      <div className="top-6 right-6 mb-4 grid grid-cols-2 items-center gap-2 md:absolute md:mb-0 md:flex">
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
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
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
