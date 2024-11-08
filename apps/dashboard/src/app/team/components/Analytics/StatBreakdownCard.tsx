"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useId } from "react";
import { Stat } from "./Stat";

type Data = {
  label: string;
  value: number;
  fill?: string;
  icon?: React.ReactNode;
};
export function StatBreakdownCard({
  title,
  data,
  // this prop allows us to leverage the formatter prop for currency formatting between server-side and client-side (since we can't pass functions to the client)
  isCurrency = false,
  formatter = isCurrency
    ? (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value)
    : undefined,
}: {
  title: string;
  data: Data[];
  isCurrency?: boolean;
  formatter?: (value: number) => string;
}) {
  const cardId = useId();
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
        <Stat value={formatter ? formatter(sum) : sum} label={title} />
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-6">
        <div>
          <div className="flex h-6 w-full overflow-hidden rounded-sm">
            {processedData.map((item, index) => (
              <div
                key={item.label}
                data-index={`${cardId}-${index}`}
                className="transition-opacity duration-200"
                style={{
                  background: item.fill,
                  width: `${(item.value / sum) * 100}%`,
                }}
                onMouseEnter={() => {
                  const bars = document.querySelectorAll(
                    `[data-index^="${cardId}"]`,
                  );
                  for (const bar of bars) {
                    if (
                      bar.getAttribute("data-index") === `${cardId}-${index}`
                    ) {
                      bar.classList.add("bg-muted/50");
                      bar.classList.remove("opacity-40");
                    } else {
                      bar.classList.remove("bg-muted/50");
                      bar.classList.add("opacity-40");
                    }
                  }
                }}
                onMouseLeave={() => {
                  const bars = document.querySelectorAll(
                    `[data-index^="${cardId}"]`,
                  );
                  for (const bar of bars) {
                    bar.classList.remove("bg-muted/50");
                    bar.classList.remove("opacity-40");
                  }
                }}
              />
            ))}
          </div>
        </div>
        <Table className="">
          <TableBody className="">
            {processedData.map((item, index) => (
              <TableRow
                key={item.label}
                data-index={`${cardId}-${index}`}
                className="px-2 text-sm hover:bg-muted/50"
                onMouseEnter={() => {
                  const bars = document.querySelectorAll(
                    `[data-index^="${cardId}"]`,
                  );
                  for (const bar of bars) {
                    if (
                      bar.getAttribute("data-index") === `${cardId}-${index}`
                    ) {
                      bar.classList.remove("opacity-40");
                    } else {
                      bar.classList.add("opacity-40");
                    }
                  }
                }}
                onMouseLeave={() => {
                  const bars = document.querySelectorAll(
                    `[data-index^="${cardId}"]`,
                  );
                  for (const bar of bars) {
                    bar.classList.remove("opacity-40");
                  }
                }}
              >
                <TableCell className="flex flex-1 items-center gap-2 px-2 py-4 text-muted-foreground">
                  {item.icon ?? (
                    <div
                      className="size-4 rounded-sm"
                      style={{ background: item.fill }}
                    />
                  )}
                  {item.label}
                </TableCell>
                <TableCell className="px-2 py-4 text-right font-semibold">
                  {formatter ? formatter(item.value) : item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
