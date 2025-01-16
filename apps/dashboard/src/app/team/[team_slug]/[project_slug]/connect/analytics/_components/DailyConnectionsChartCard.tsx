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
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import type { WalletStats } from "types/analytics";
import { formatTickerNumber } from "../../../../../../../lib/format-utils";

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
    <div className="relative w-full rounded-lg border border-border bg-card p-4 md:p-6">
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
          fileName="DailyConnections"
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
          <EmptyChartState>
            <div className="flex flex-col items-center justify-center">
              <span className="mb-6 text-lg">
                Send your first connect event
              </span>
              <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
                <DocLink
                  link="https://portal.thirdweb.com/typescript/v5/getting-started"
                  label="TypeScript"
                  icon={TypeScriptIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/react/v5"
                  label="React"
                  icon={ReactIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/react-native/v5"
                  label="React Native"
                  icon={ReactIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/dotnet/getting-started"
                  label="Unity"
                  icon={UnityIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/unreal-engine/getting-started"
                  label="Unreal Engine"
                  icon={UnrealIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/dotnet/getting-started"
                  label=".NET"
                  icon={DotNetIcon}
                />
              </div>
            </div>
          </EmptyChartState>
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

            <YAxis
              dataKey={(data) => data[chartToShow]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatTickerNumber(value)}
            />

            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  valueFormatter={(value) => formatTickerNumber(Number(value))}
                />
              }
            />

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
                  formatter={(value: number) => formatTickerNumber(value)}
                />
              )}
            </Bar>
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
}
