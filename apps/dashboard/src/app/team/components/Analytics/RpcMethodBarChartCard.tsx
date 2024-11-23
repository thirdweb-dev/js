import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AnalyticsQueryParams,
  getRpcMethodUsage,
  RpcMethodStats,
} from "@/api/analytics";
import { EmptyState } from "./EmptyState";
import { formatTickerNumber } from "lib/format-utils";

const chartConfig = {
  evmMethod: { label: "EVM Method", color: "hsl(var(--chart-1))" },
  count: { label: "Count", color: "hsl(var(--chart-2))" },
};

export async function RpcMethodBarChartCard(props: AnalyticsQueryParams) {
  const rawData = await getRpcMethodUsage(props);

  return <RpcMethodBarChartCardUI rawData={rawData} />;
}

// Split the UI out for storybook mocking
export function RpcMethodBarChartCardUI({
  rawData,
}: { rawData: RpcMethodStats[] }) {
  const uniqueMethods = Array.from(new Set(rawData.map((d) => d.evmMethod)));
  const uniqueDates = Array.from(new Set(rawData.map((d) => d.date)));

  const data = uniqueDates.map((date) => {
    const dateData: { [key: string]: string | number } = { date };
    for (const method of uniqueMethods) {
      const methodData = rawData.find(
        (d) => d.date === date && d.evmMethod === method,
      );
      dateData[method] = methodData?.count ?? 0;
    }
    return dateData;
  });

  const config: ChartConfig = {};
  for (const method of uniqueMethods) {
    config[method] = {
      label: method,
    };
  }

  if (rawData.length === 0 || rawData.every((d) => d.count === 0)) {
    return <EmptyState />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 p-6">
          <CardTitle className="font-semibold text-lg">RPC Methods</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 sm:pl-0">
        <ChartContainer
          config={{
            ...chartConfig,
          }}
          className="aspect-auto h-[250px] w-full pt-6"
        >
          <RechartsBarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => formatTickerNumber(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  valueFormatter={(v: unknown) =>
                    formatTickerNumber(v as number)
                  }
                />
              }
            />
            {uniqueMethods.map((method, idx) => (
              <Bar
                key={method}
                stackId="a"
                dataKey={method}
                radius={4}
                fill={`hsl(var(--chart-${idx}))`}
              />
            ))}
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
