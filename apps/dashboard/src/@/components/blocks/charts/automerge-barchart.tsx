"use client";
import { format } from "date-fns";
import { useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import type { ChartConfig } from "@/components/ui/chart";
import { TotalValueChartHeader } from "./chart-header";

export type StatData = {
  date: string;
  count: number;
  label: string;
};

type ChartData = Record<string, number> & {
  time: string; // human readable date
};

const defaultLabel = "Unknown";

// merges the multiple stats in single bar if they share the same date
// shows the top `maxLabelsToShow` labels, merge the rest into "Others"

export function AutoMergeBarChart(props: {
  stats: StatData[];
  isPending: boolean;
  title: string;
  emptyChartState: React.ReactElement | undefined;
  description: string | undefined;
  maxLabelsToShow: number;
  exportButton:
    | {
        fileName: string;
      }
    | undefined;
  viewMoreLink: string | undefined;
}) {
  const { stats, maxLabelsToShow } = props;

  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {};
    const _chartDataMap: Map<string, ChartData> = new Map();
    const labelToCountMap: Map<string, number> = new Map();
    // for each stat, add it in _chartDataMap
    for (const stat of stats) {
      const chartData = _chartDataMap.get(stat.date);

      // if no data for current day - create new entry
      if (!chartData && stat.count > 0) {
        _chartDataMap.set(stat.date, {
          time: stat.date,
          [stat.label || defaultLabel]: stat.count,
        } as ChartData);
      } else if (chartData) {
        chartData[stat.label || defaultLabel] =
          (chartData[stat.label || defaultLabel] || 0) + stat.count;
      }

      labelToCountMap.set(
        stat.label || defaultLabel,
        stat.count + (labelToCountMap.get(stat.label || defaultLabel) || 0),
      );
    }

    const labelsSorted = Array.from(labelToCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((w) => w[0]);

    const labelsToShow = labelsSorted.slice(0, maxLabelsToShow);
    const labelsToShowAsOther = labelsSorted.slice(maxLabelsToShow);

    // replace chainIdsToTagAsOther chainId with "other"
    for (const data of _chartDataMap.values()) {
      for (const dataKey in data) {
        if (labelsToShowAsOther.includes(dataKey)) {
          data.others = (data.others || 0) + (data[dataKey] || 0);
          delete data[dataKey];
        }
      }
    }

    labelsToShow.forEach((walletType, i) => {
      _chartConfig[walletType] = {
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
        label: labelsToShow[i],
      };
    });

    // Add Other
    if (labelsToShow.length >= maxLabelsToShow) {
      labelsToShow.push("others");
      _chartConfig.others = {
        color: "hsl(var(--muted-foreground))",
        label: "Others",
      };
    }

    return {
      chartConfig: _chartConfig,
      chartData: Array.from(_chartDataMap.values()).sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      ),
    };
  }, [stats, maxLabelsToShow]);

  const uniqueLabels = Object.keys(chartConfig);

  const total = useMemo(() => {
    return props.stats.reduce((acc, stat) => acc + stat.count, 0);
  }, [props.stats]);

  return (
    <ThirdwebBarChart
      chartClassName="h-[275px] w-full"
      config={chartConfig}
      customHeader={
        props.viewMoreLink ? (
          <TotalValueChartHeader
            total={total}
            title={props.title}
            isPending={props.isPending}
            viewMoreLink={props.viewMoreLink}
          />
        ) : (
          <div className="relative px-6 pt-6">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg tracking-tight leading-none">
                {props.title}
              </h3>
              {props.description && (
                <p className="text-muted-foreground text-sm">
                  {props.description}
                </p>
              )}
            </div>

            {props.exportButton && props.stats.length > 0 && (
              <ExportToCSVButton
                className="top-6 right-6 mb-4 w-full bg-background md:absolute md:mb-0 md:flex md:w-auto"
                fileName={props.exportButton.fileName}
                getData={async () => {
                  // Shows the number of each type of wallet connected on all dates
                  const header = ["Time", ...uniqueLabels];
                  const rows = chartData.map((data) => {
                    const { time, ...rest } = data;
                    return [
                      new Date(time).toISOString(),
                      ...uniqueLabels.map((w) => (rest[w] || 0).toString()),
                    ];
                  });
                  return { header, rows };
                }}
              />
            )}
          </div>
        )
      }
      data={chartData}
      emptyChartState={props.emptyChartState}
      hideLabel={false}
      isPending={props.isPending}
      showLegend
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as number;
          return format(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
      variant="stacked"
    />
  );
}
