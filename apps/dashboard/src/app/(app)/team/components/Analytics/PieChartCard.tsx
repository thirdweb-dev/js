import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
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
}: {
  title: string;
  data: ChartData[];
  aggregateFn?: (data: ChartData[]) => number;
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
        label: "Other",
        value: otherValue,
        fill: "orange",
      });
    }

    return top10;
  })().map((item, index) => ({
    ...item,
    fill: item.fill || `hsl(var(--chart-${index + 1}))`,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-border border-b p-0">
        <Stat value={aggregateFn(data)} label={title} />
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <PieChart title={title} data={processedData} />
      </CardContent>
      <CardFooter className="no-scrollbar flex max-w-full justify-center p-6 pt-0 max-md:overflow-x-auto">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2.5">
          {processedData.map(
            ({
              label,
              fill,
              link,
            }: { label: string; fill?: string; link?: string }) => (
              <div key={fill} className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{ background: fill }}
                />
                {link ? (
                  <Link
                    href={link}
                    target="_blank"
                    className="text-muted-foreground text-xs hover:text-link-foreground"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className="text-muted-foreground text-xs">{label}</span>
                )}
              </div>
            ),
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
