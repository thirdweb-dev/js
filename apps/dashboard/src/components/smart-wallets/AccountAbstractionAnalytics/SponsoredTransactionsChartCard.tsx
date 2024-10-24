"use client";

import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { UserOpStats } from "@3rdweb-sdk/react/hooks/useApi";
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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = {
  time: string; // human readable date
  failed: number;
  successful: number;
};

const chartConfig = {
  successful: {
    label: "Successful",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Failed",
    color: "red",
  },
};
export function SponsoredTransactionsChartCard(props: {
  userOpStats: UserOpStats[];
  isPending: boolean;
}) {
  const { userOpStats } = props;

  const barChartData: ChartData[] = useMemo(() => {
    const chartDataMap: Map<string, ChartData> = new Map();

    for (const data of userOpStats) {
      const chartData = chartDataMap.get(data.date);
      if (!chartData) {
        chartDataMap.set(data.date, {
          time: format(new Date(data.date), "MMM dd"),
          successful: data.successful,
          failed: data.failed,
        });
      } else {
        chartData.successful += data.successful;
        chartData.failed += data.failed;
      }
    }

    return Array.from(chartDataMap.values());
  }, [userOpStats]);

  const disableActions = props.isPending || barChartData.length === 0;

  return (
    <div className="relative w-full rounded-lg border border-border bg-muted/50 p-4 md:p-6">
      <h3 className="mb-4 font-semibold text-xl tracking-tight md:text-2xl">
        Sponsored Transactions
      </h3>

      <div className="top-6 right-6 mb-8 grid grid-cols-2 items-center gap-2 md:absolute md:mb-0 md:flex">
        <ExportToCSVButton
          className="bg-background"
          fileName="Sponsored Transactions"
          disabled={disableActions}
          getData={async () => {
            const header = ["Date", "Successful", "Failed"];
            const rows = barChartData.map((data) => {
              const { time, successful, failed } = data;
              return [time, successful.toString(), failed.toString()];
            });
            return { header, rows };
          }}
        />
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        {props.isPending ? (
          <LoadingChartState />
        ) : barChartData.length === 0 ||
          barChartData.every(
            (data) => data.failed === 0 && data.successful === 0,
          ) ? (
          <EmptyChartState>
            <div className="flex flex-col items-center justify-center">
              <span className="mb-6 text-lg">
                Send your first sponsored transaction
              </span>
              <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
                <DocLink
                  link="https://portal.thirdweb.com/typescript/v5/account-abstraction/batching-transactions"
                  label="TypeScript"
                  icon={TypeScriptIcon}
                />
                <DocLink
                  link="https://portal.thirdweb.com/react/v5/account-abstraction/batching-transactions"
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
            <ChartLegend content={<ChartLegendContent />} />
            {(["failed", "successful"] as const).map((result) => {
              return (
                <Bar
                  key={result}
                  dataKey={result}
                  fill={chartConfig[result].color}
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
