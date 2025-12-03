import Link from "next/link";
import { useMemo } from "react";
import {
  EmptyChartState,
  LoadingChartState,
} from "@/components/analytics/empty-chart-state";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PieChart } from "./PieChart";
import { Stat } from "./Stat";

type ChartData = {
  value: number;
  label: string;
  fill?: string;
  link?: string;
};
export function PieChartCard({
  title,
  data,
  aggregateFn = (data) => data.reduce((acc, curr) => acc + curr.value, 0),
  isCurrency = false,
  customHeader,
  isPending = false,
  emptyChartState,
}: {
  title: string;
  data: ChartData[];
  aggregateFn?: (data: ChartData[]) => number;
  isCurrency?: boolean;
  customHeader?: React.ReactNode;
  isPending?: boolean;
  emptyChartState?: React.ReactNode;
}) {
  const processedData = (() => {
    // Sort by value descending
    const sorted = [...data].sort((a, b) => b.value - a.value);

    if (sorted.length <= 9) return sorted;

    // Take top 9
    const top10 = sorted.slice(0, 9).map((item) => ({
      ...item,
    }));

    // Aggregate the rest
    const otherValue = sorted
      .slice(9)
      .reduce((sum, item) => sum + item.value, 0);

    if (otherValue > 0) {
      top10.push({
        fill: "orange",
        label: "Other",
        value: otherValue,
      });
    }

    return top10;
  })().map((item, index) => ({
    ...item,
    fill: item.fill || `hsl(var(--chart-${index + 1}))`,
  }));

  const isAllEmpty = useMemo(() => {
    return data.every((item) => item.value === 0);
  }, [data]);

  return (
    <Card className="flex flex-col">
      {customHeader || (
        <CardHeader className="border-border border-b p-0">
          <Stat label={title} value={aggregateFn(data)} />
        </CardHeader>
      )}

      <CardContent className="flex-1 p-4">
        {isPending ? (
          <LoadingChartState />
        ) : isAllEmpty ? (
          <EmptyChartState type="none"> {emptyChartState} </EmptyChartState>
        ) : (
          <PieChart
            data={processedData}
            title={title}
            isCurrency={isCurrency}
          />
        )}
      </CardContent>
      {!isAllEmpty && (
        <CardFooter className="no-scrollbar flex max-w-full justify-center p-6 pt-0 max-md:overflow-x-auto">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2.5">
            {processedData.map(
              ({
                label,
                fill,
                link,
              }: {
                label: string;
                fill?: string;
                link?: string;
              }) => (
                <div className="flex items-center gap-2" key={fill}>
                  <div
                    className="size-2 rounded-full"
                    style={{ background: fill }}
                  />
                  {link ? (
                    <Link
                      className="text-muted-foreground text-xs hover:text-link-foreground"
                      href={link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {label}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      {label}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
