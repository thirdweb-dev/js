"use client";
import { useSetResponsiveSearchParams } from "responsive-rsc";
import { CombinedBarChartCard } from "../../../../components/Analytics/CombinedBarChartCard";

type TimeSeriesMetrics = {
  date: string;
  mainnet: number;
  testnet: number;
  total: number;
};

export function TotalSponsoredCardUI(props: {
  selectedChart: string | undefined;
  selectedChartQueryParam: string;
  timeSeriesData: TimeSeriesMetrics[];
  processedAggregatedData: {
    mainnet: number;
    testnet: number;
    total: number;
  };
}) {
  const {
    selectedChart,
    selectedChartQueryParam,
    processedAggregatedData,
    timeSeriesData,
  } = props;

  const setResponsiveSearchParams = useSetResponsiveSearchParams();
  const chartConfig = {
    mainnet: {
      color: "hsl(var(--chart-1))",
      label: "Mainnet Chains",
    },
    testnet: {
      color: "hsl(var(--chart-2))",
      label: "Testnet Chains",
    },
    total: {
      color: "hsl(var(--chart-3))",
      label: "All Chains",
    },
  };

  return (
    <CombinedBarChartCard
      activeChart={(selectedChart as keyof typeof chartConfig) ?? "mainnet"}
      aggregateFn={(_data, key) => processedAggregatedData[key]}
      chartConfig={chartConfig}
      data={timeSeriesData}
      isCurrency
      onSelect={(key) => {
        setResponsiveSearchParams((v) => {
          return {
            ...v,
            [selectedChartQueryParam]: key,
          };
        });
      }}
      title="Gas Sponsored"
      // Get the trend from the last two COMPLETE periods
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 3
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[data.length - 3]?.[key] as number) ?? 0) -
            1
          : undefined
      }
    />
  );
}
