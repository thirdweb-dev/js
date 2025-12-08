import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toUSD } from "@/utils/number";
import { BarChart } from "./BarChart";
import { Stat } from "./Stat";

export type CombinedBarChartConfig<K extends string> = {
  [key in K]: {
    label: string;
    color: string;
    isCurrency?: boolean;
    emptyContent?: React.ReactNode;
    hideAsTab?: boolean;
    stackedKeys?: string[];
  };
};

export function CombinedBarChartCard<
  T extends string,
  K extends Exclude<T, "date">,
>({
  title,
  chartConfig,
  data,
  activeChart,
  isCurrency = false,
  aggregateFn = (data, key) =>
    data[data.length - 1]?.[key] as number | undefined,
  trendFn = (data, key) =>
    data.filter((d) => (d[key] as number) > 0).length >= 2
      ? ((data[data.length - 1]?.[key] as number) ?? 0) /
          ((data[data.length - 2]?.[key] as number) ?? 0) -
        1
      : undefined,
  className,
  onSelect,
}: {
  title?: string;
  chartConfig: CombinedBarChartConfig<K>;
  data: { [key in T]: number | string }[];
  activeChart: K;
  isCurrency?: boolean;
  aggregateFn?: (d: typeof data, key: K) => number | undefined;
  trendFn?: (d: typeof data, key: K) => number | undefined;
  onSelect: (key: K) => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        {title && (
          <div className="flex flex-1 flex-col justify-center gap-1 p-6">
            <CardTitle className="font-semibold text-lg">{title}</CardTitle>
          </div>
        )}

        <div className="max-md:no-scrollbar overflow-x-auto border-t">
          <div className="flex flex-nowrap">
            {Object.keys(chartConfig)
              .filter((chart) => !chartConfig[chart as K]?.hideAsTab)
              .map((chart: string) => {
                const key = chart as K;
                return (
                  <Button
                    variant="ghost"
                    className="rounded-none p-0 h-auto bg-transparent relative z-30 flex min-w-[200px] flex-1 flex-col items-start justify-center gap-1 border-l first:border-l-0 hover:bg-accent/50"
                    data-active={activeChart === chart}
                    onClick={() => onSelect(key)}
                    key={chart}
                  >
                    <Stat
                      label={chartConfig[key].label}
                      trend={trendFn(data, key) || undefined}
                      value={
                        isCurrency || chartConfig[key].isCurrency
                          ? toUSD(aggregateFn(data, key) ?? 0)
                          : (aggregateFn(data, key) ?? 0)
                      }
                    />
                    <div
                      className="absolute right-0 bottom-0 left-0 h-0 bg-foreground transition-all duration-300 ease-out data-[active=true]:h-[3px]"
                      data-active={activeChart === chart}
                    />
                  </Button>
                );
              })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <BarChart
          activeKey={activeChart}
          chartConfig={chartConfig}
          data={data}
          emptyChartContent={chartConfig[activeChart].emptyContent}
          isCurrency={isCurrency}
          tooltipLabel={title}
        />
      </CardContent>
    </Card>
  );
}
