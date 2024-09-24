"use client";

import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import {
  type ChartConfig,
  ChartContainer,
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
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { EmptyChartState, LoadingChartState } from "./EmptyChartState";

type ChartToShow = "uniqueWallets" | "totalWallets";

type ChartData = {
  time: string; // human readable date
  totalWallets: number;
  uniqueWallets: number;
};

const chartConfig = {
  uniqueWallets: {
    label: "Unique Wallets",
    color: "hsl(var(--chart-1))",
  },
  totalWallets: {
    label: "Total Wallets",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const chartLabelToShow: Record<ChartToShow, string> = {
  uniqueWallets: "Unique Wallets",
  totalWallets: "Total Wallets",
};

export function DailyConnectionsChartCard(props: {
  walletStats: WalletStats[];
  isPending: boolean;
}) {
  const { walletStats } = props;

  const [chartToShow, setChartToShow] = useState<ChartToShow>("uniqueWallets");
  const chartToShowOptions: ChartToShow[] = ["uniqueWallets", "totalWallets"];

  const barChartData: ChartData[] = useMemo(() => {
    const chartDataMap: Map<string, ChartData> = new Map();

    for (const data of walletStats) {
      const chartData = chartDataMap.get(data.date);
      if (!chartData) {
        chartDataMap.set(data.date, {
          time: format(new Date(data.date), "MMM dd"),
          totalWallets: data.totalConnections,
          uniqueWallets: data.uniqueWalletsConnected,
        });
      } else {
        chartData.totalWallets += data.totalConnections;
        chartData.uniqueWallets += data.uniqueWalletsConnected;
      }
    }

    return Array.from(chartDataMap.values());
  }, [walletStats]);

  const disableActions = props.isPending || barChartData.length === 0;

  return (
    <div className="relative w-full rounded-lg border border-border bg-muted/50 p-4 md:p-6">
      <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
        Daily Connections
      </h3>
      <p className="mb-3 text-muted-foreground text-sm">
        Total and unique wallets addresses that connected to your app each day.
      </p>

      <div className="top-6 right-6 mb-4 grid grid-cols-2 items-center gap-2 md:absolute md:mb-0 md:flex">
        {/* Selector */}
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
          disabled={disableActions}
          className="bg-background"
          getData={async () => {
            const header = ["Date", "Total Wallets", "Unique Wallets"];
            const rows = barChartData.map((row) => [
              row.time,
              row.totalWallets.toString(),
              row.uniqueWallets.toString(),
            ]);
            return { header, rows };
          }}
          fileName="DialyConnections"
        />
      </div>

      {/* Chart */}
      <ChartContainer
        config={chartConfig}
        className="h-[250px] w-full md:h-[350px]"
      >
        {props.isPending ? (
          <LoadingChartState />
        ) : barChartData.length === 0 ? (
          <EmptyChartState />
        ) : (
          <BarChart
            accessibilityLayer
            data={barChartData}
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

            <Bar
              dataKey={chartToShow}
              fill={`var(--color-${chartToShow})`}
              radius={8}
            >
              {barChartData.length < 50 && (
                <LabelList
                  position="top"
                  offset={12}
                  className="invisible fill-foreground sm:visible"
                  fontSize={12}
                />
              )}
            </Bar>
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
}
