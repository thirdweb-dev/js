import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toUSD } from "utils/number";
import { Stat } from "./Stat";
import { StatBreakdown } from "./StatBreakdown";

type Data = {
  label: string;
  value: number;
  fill?: string;
  icon?: React.ReactNode;
};
export function StatBreakdownCard({
  title,
  data,
  isCurrency = false,
}: {
  title: string;
  data: Data[];
  isCurrency?: boolean;
}) {
  const processedData = (() => {
    if (data.length <= 4) return data;

    // Sort by value descending
    const sorted = [...data].sort((a, b) => b.value - a.value);

    // Take top 4
    const top4 = sorted.slice(0, 4);

    // Aggregate the rest
    const otherValue = sorted
      .slice(4)
      .reduce((sum, item) => sum + item.value, 0);

    if (otherValue > 0) {
      top4.push({
        label: "Other",
        value: otherValue,
        fill: "hsl(var(--muted-foreground))",
      });
    }

    return top4;
  })();

  const sum = processedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-border border-b p-0">
        <Stat
          value={isCurrency ? toUSD(sum) : sum.toLocaleString()}
          label={title}
        />
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-6">
        <StatBreakdown data={processedData} isCurrency={isCurrency} />
      </CardContent>
    </Card>
  );
}
