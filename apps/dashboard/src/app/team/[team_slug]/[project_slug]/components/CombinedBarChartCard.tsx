import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BarChart } from "./BarChart";
import { Stat } from "./Stat";

type CombinedBarChartConfig<K extends string> = {
  [key in K]: { label: string; color: string };
};

export function CombinedBarChartCard<
  T extends string,
  K extends Exclude<T, "date">,
>({
  title,
  chartConfig,
  data,
  activeChart,
  aggregateFn = (data, key) =>
    data[data.length - 1]?.[key] as number | undefined,
  trendFn = (data, key) =>
    data.filter((d) => (d[key] as number) > 0).length >= 2
      ? ((data[data.length - 1]?.[key] as number) ?? 0) /
          ((data[data.length - 2]?.[key] as number) ?? 0) -
        1
      : undefined,
  existingQueryParams,
}: {
  title?: string;
  chartConfig: CombinedBarChartConfig<K>;
  data: { [key in T]: number | string }[];
  activeChart: K;
  aggregateFn?: (d: typeof data, key: K) => number | undefined;
  trendFn?: (d: typeof data, key: K) => number | undefined;
  existingQueryParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Card className="max-md:rounded-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        {title && (
          <div className="flex flex-1 flex-col justify-center gap-1 p-6">
            <CardTitle className="font-semibold text-lg">{title}</CardTitle>
          </div>
        )}
        <div className="max-md:no-scrollbar overflow-x-auto border-t">
          <div className="flex flex-nowrap">
            {Object.keys(chartConfig).map((chart: string) => {
              const key = chart as K;
              return (
                <Link
                  href={{
                    query: {
                      ...existingQueryParams,
                      usersChart: key,
                    },
                  }}
                  scroll={false}
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex min-w-[200px] flex-1 flex-col justify-center gap-1 border-l first:border-l-none hover:bg-muted/50"
                >
                  <Stat
                    label={chartConfig[key].label}
                    value={aggregateFn(data, key) ?? "--"}
                    trend={trendFn(data, key) || undefined}
                  />
                  <div
                    className="absolute right-0 bottom-0 left-0 h-0 bg-foreground transition-all duration-300 ease-out data-[active=true]:h-[3px]"
                    data-active={activeChart === chart}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 sm:pl-0">
        <BarChart
          tooltipLabel={title}
          chartConfig={chartConfig}
          data={data}
          activeKey={activeChart}
        />
      </CardContent>
    </Card>
  );
}
