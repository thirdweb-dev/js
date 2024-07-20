"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../@/components/ui/toggle-group";
import type { TimeRange } from "../../../lib/search";

export function TimeRangeSwitcher() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams?.get("sortBy") || "transactionCount";
  return (
    <ToggleGroup
      type="single"
      value={searchParams?.get("timeRange") || "day"}
      onValueChange={async (value: TimeRange) => {
        router.replace(
          `${path}?timeRange=${value}${currentSort ? `&sortBy=${currentSort}` : ""}`,
          {
            scroll: false,
          },
        );
      }}
    >
      <ToggleGroupItem value="day">Last 24h</ToggleGroupItem>
      <ToggleGroupItem value="week">Last 7 Days</ToggleGroupItem>
      <ToggleGroupItem value="month">Last 30 Days</ToggleGroupItem>
    </ToggleGroup>
  );
}
