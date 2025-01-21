"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useId, useMemo } from "react";
import { toUSD } from "utils/number";

type Data = {
  label: string;
  value: number;
  fill?: string;
  icon?: React.ReactNode;
};

export function StatBreakdown({
  data,
  isCurrency = false,
}: { data: Data[]; isCurrency?: boolean }) {
  const cardId = useId();
  const sum = useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-6 w-full overflow-hidden rounded-sm">
        {data.map((item, index) => (
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
                if (bar.getAttribute("data-index") === `${cardId}-${index}`) {
                  bar.classList.add("bg-card");
                  bar.classList.remove("opacity-40");
                } else {
                  bar.classList.remove("bg-card");
                  bar.classList.add("opacity-40");
                }
              }
            }}
            onMouseLeave={() => {
              const bars = document.querySelectorAll(
                `[data-index^="${cardId}"]`,
              );
              for (const bar of bars) {
                bar.classList.remove("bg-card");
                bar.classList.remove("opacity-40");
              }
            }}
          />
        ))}
      </div>
      <Table className="">
        <TableBody className="">
          {data.map((item, index) => (
            <TableRow
              key={item.label}
              data-index={`${cardId}-${index}`}
              className="px-2 text-sm hover:bg-card"
              onMouseEnter={() => {
                const bars = document.querySelectorAll(
                  `[data-index^="${cardId}"]`,
                );
                for (const bar of bars) {
                  if (bar.getAttribute("data-index") === `${cardId}-${index}`) {
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
                {isCurrency ? toUSD(item.value) : item.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
