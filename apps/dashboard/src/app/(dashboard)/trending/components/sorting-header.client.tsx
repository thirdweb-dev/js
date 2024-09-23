"use client";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import type { SortBy, TimeRange } from "../../../../lib/search";

type SortingHeaderProps = {
  sortBy: string;
  title: string;
  searchParams:
    | { timeRange?: TimeRange; page?: number; sortBy?: SortBy }
    | undefined;
};

export function SortingHeader(props: SortingHeaderProps) {
  const router = useDashboardRouter();
  const path = usePathname();
  const enableSorting = !!props.searchParams;
  const { timeRange, page, sortBy } = props.searchParams || {};
  const currentSort = sortBy || "transactionCount";
  const isCurrentSort = currentSort === props.sortBy;
  const justify =
    props.sortBy === "transactionCountChange" ? "justify-start" : "justify-end";

  if (!enableSorting) {
    return <div className={cn("flex flex-row", justify)}>{props.title}</div>;
  }

  return (
    <div className={cn("flex flex-row", justify)}>
      <Button
        className="flex cursor-pointer flex-row items-center gap-1 px-0"
        variant="link"
        onClick={() => {
          router.replace(
            `${path}?sortBy=${props.sortBy}${timeRange?.length ? `&timeRange=${timeRange}` : ""}${page ? `&page=${page}` : ""}`,
            {
              scroll: false,
            },
          );
        }}
      >
        {isCurrentSort && <ChevronDown className="size-4 shrink-0" />}
        {props.title}
      </Button>
    </div>
  );
}
