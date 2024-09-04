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
  walletStats: WalletStats;
  isLoading: boolean;
}) {
  const { walletStats } = props;

  const [chartToShow, setChartToShow] = useState<ChartToShow>("uniqueWallets");
  const chartToShowOptions: ChartToShow[] = ["uniqueWallets", "totalWallets"];

  const barChartData: ChartData[] = useMemo(() => {
    const chartDataMap: Map<string, ChartData> = new Map();

    for (const data of walletStats.timeSeries) {
      const chartData = chartDataMap.get(data.dayTime);
      if (!chartData) {
        chartDataMap.set(data.dayTime, {
          time: format(new Date(data.dayTime), "MMM dd"),
          totalWallets: data.totalWallets,
          uniqueWallets: data.uniqueWallets,
        });
      } else {
        chartData.totalWallets += data.totalWallets;
        chartData.uniqueWallets += data.uniqueWallets;
      }
    }

    return Array.from(chartDataMap.values());
  }, [walletStats]);

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 relative w-full">
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">
        Daily Connections
      </h3>
      <p className="text-muted-foreground mb-3 text-sm">
        Total and unique wallets addresses that connected to your app each day.
      </p>

      {/* Selector */}
      <Select
        onValueChange={(v) => {
          setChartToShow(v as ChartToShow);
        }}
        value={chartToShow}
        disabled={props.isLoading || barChartData.length === 0}
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
        className="w-full h-[250px] md:h-[350px]"
      >
        {props.isLoading ? (
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
                  className="fill-foreground invisible sm:visible"
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
