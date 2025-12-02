"use client";
import { format } from "date-fns";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { TotalValueChartHeader } from "@/components/blocks/charts/chart-header";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import type { AIUsageStats } from "@/types/analytics";

type ChartData = Record<string, number> & {
  time: string; // human readable date
  tokens: number;
};

export function AiTokenUsageChartCardUI(props: {
  aiUsageStats: AIUsageStats[];
  isPending: boolean;
  title: string;
  viewMoreLink: string | undefined;
}) {
  const { aiUsageStats } = props;

  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {
      tokens: {
        color: "hsl(var(--chart-1))",
        label: "Tokens",
      },
    };

    const _chartData: ChartData[] = aiUsageStats
      .filter((stat) => stat.totalPromptTokens + stat.totalCompletionTokens > 0)
      .map(
        (stat) =>
          ({
            time: stat.date,
            tokens: stat.totalPromptTokens + stat.totalCompletionTokens,
          }) as ChartData,
      );

    return {
      chartConfig: _chartConfig,
      chartData: _chartData.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      ),
    };
  }, [aiUsageStats]);

  const disableActions =
    props.isPending ||
    chartData.length === 0 ||
    chartData.every((data) => data.tokens === 0);

  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.tokens, 0);
  }, [chartData]);

  return (
    <ThirdwebBarChart
      chartClassName="h-[275px] w-full aspect-auto"
      config={chartConfig}
      customHeader={
        props.viewMoreLink ? (
          <TotalValueChartHeader
            isPending={props.isPending}
            total={total}
            title={props.title}
            viewMoreLink={props.viewMoreLink}
          />
        ) : (
          <div className="relative px-6 pt-6">
            <h3 className="font-semibold text-xl tracking-tight">
              {props.title}
            </h3>

            <ExportToCSVButton
              className="top-6 right-6 mb-4 w-full bg-background md:absolute md:mb-0 md:flex md:w-auto"
              disabled={disableActions}
              fileName="AI Token Usage"
              getData={async () => {
                const header = ["Date", "Tokens"];
                const rows = chartData.map((data) => [
                  data.time,
                  data.tokens.toString(),
                ]);
                return { header, rows };
              }}
            />
          </div>
        )
      }
      data={chartData}
      emptyChartState={<AiTokenUsageEmptyChartState />}
      hideLabel={false}
      isPending={props.isPending}
      showLegend={false}
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as string;
          return format(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
      variant="stacked"
    />
  );
}

function AiTokenUsageEmptyChartState() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <h3 className="text-base font-semibold text-foreground mb-1 text-center">
        No data available
      </h3>
      <p className="mb-6 text-center text-sm">
        Integrate thirdweb AI to interact with any EVM chain using natural
        language
      </p>
      <Button
        asChild
        size="sm"
        variant="default"
        className="rounded-full gap-2"
      >
        <Link href="https://portal.thirdweb.com/ai/chat" target="_blank">
          Get Started
          <ArrowUpRightIcon className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
