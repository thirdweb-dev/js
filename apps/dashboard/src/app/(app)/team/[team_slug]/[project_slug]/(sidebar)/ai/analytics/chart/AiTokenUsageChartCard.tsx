"use client";
import { format } from "date-fns";
import { useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { DocLink } from "@/components/blocks/DocLink";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import type { ChartConfig } from "@/components/ui/chart";
import { ReactIcon } from "@/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "@/icons/brand-icons/TypeScriptIcon";
import type { AIUsageStats } from "@/types/analytics";

type ChartData = {
  time: string; // human readable date
  tokens: number;
};

export function AiTokenUsageChartCardUI(props: {
  aiUsageStats: AIUsageStats[];
  isPending: boolean;
  title: string;
  description: string;
}) {
  const { aiUsageStats } = props;

  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {
      tokens: {
        color: "hsl(var(--chart-1))",
        label: "Tokens",
      },
    };

    const _chartData: ChartData[] = aiUsageStats.map((stat) => ({
      time: stat.date,
      tokens: stat.totalPromptTokens + stat.totalCompletionTokens,
    }));

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

  return (
    <ThirdwebBarChart
      chartClassName="aspect-[1.5] lg:aspect-[3.5]"
      config={chartConfig}
      customHeader={
        <div className="relative px-6 pt-6">
          <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
            {props.title}
          </h3>
          <p className="mb-3 text-muted-foreground text-sm">
            {props.description}
          </p>

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
      variant="default"
    />
  );
}

function AiTokenUsageEmptyChartState() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <span className="mb-6 text-center text-lg">
        Start using AI to interact with any EVM chain
      </span>
      <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <DocLink
          icon={TypeScriptIcon}
          label="TypeScript"
          link="https://portal.thirdweb.com/ai/chat"
        />
        <DocLink
          icon={ReactIcon}
          label="React"
          link="https://portal.thirdweb.com/ai/chat"
        />
      </div>
    </div>
  );
}