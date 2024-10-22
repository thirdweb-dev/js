"use client";

import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { UserOpStats } from "@3rdweb-sdk/react/hooks/useApi";
import { DotNetIcon } from "components/icons/brand-icons/DotNetIcon";
import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "components/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "components/icons/brand-icons/UnrealIcon";
import { DocLink } from "components/shared/DocLink";
import { format } from "date-fns";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { EmptyChartState, LoadingChartState } from "./EmptyChartState";

type ChartData = {
  time: string; // human readable date
  sponsoredUsd: number;
};

const chartConfig = {
  sponsoredUsd: {
    label: "Total Sponsored",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TotalSponsoredChartCard(props: {
  userOpStats: UserOpStats[];
  isPending: boolean;
}) {
  const { userOpStats } = props;
  const barChartData: ChartData[] = useMemo(() => {
    const chartDataMap: Map<string, ChartData> = new Map();

    for (const data of userOpStats) {
      const chartData = chartDataMap.get(data.date);
      if (!chartData && data.sponsoredUsd > 0) {
        chartDataMap.set(data.date, {
          time: format(new Date(data.date), "MMM dd"),
          sponsoredUsd: data.sponsoredUsd,
        });
      } else if (chartData && data.sponsoredUsd > 0) {
        chartData.sponsoredUsd += data.sponsoredUsd;
      }
    }

    return Array.from(chartDataMap.values());
  }, [userOpStats]);

  const disableActions = props.isPending || barChartData.length === 0;

  return (
    <div className="relative w-full rounded-lg border border-border bg-muted/50 p-4 md:p-6">
      <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
        Gas Sponsored
      </h3>
      <p className="mb-3 text-muted-foreground text-sm">
        The total amount of gas sponsored in USD.
      </p>

      <div className="top-6 right-6 mb-4 grid grid-cols-2 items-center gap-2 md:absolute md:mb-0 md:flex">
        <ExportToCSVButton
          disabled={disableActions}
          className="bg-background"
          getData={async () => {
            const header = ["Date", "Total Sponsored"];
            const rows = barChartData.map((row) => [
              row.time,
              row.sponsoredUsd.toString(),
            ]);
            return { header, rows };
          }}
          fileName="Total Sponsored"
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
              dataKey={"sponsoredUsd"}
              fill={"var(--color-sponsoredUsd)"}
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
