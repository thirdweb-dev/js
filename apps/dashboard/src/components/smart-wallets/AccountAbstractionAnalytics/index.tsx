"use client";

import { useUserOpUsagePeriod } from "@3rdweb-sdk/react/hooks/useApi";
import {
  DateRangeSelector,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import { differenceInDays } from "date-fns";
import { useState } from "react";
import { SponsoredTransactionsChartCard } from "./SponsoredTransactionsChartCard";
import { TotalSponsoredChartCard } from "./TotalSponsoredChartCard";

export function AccountAbstractionAnalytics({
  clientId,
}: { clientId: string }) {
  const [range, setRange] = useState<Range>(() =>
    getLastNDaysRange("last-120"),
  );

  // use date-fns to calculate the number of days in the range
  const daysInRange = differenceInDays(range.to, range.from);
  const [intervalType, setIntervalType] = useState<"day" | "week">(
    daysInRange > 30 ? "week" : "day",
  );

  const userOpUsageQuery = useUserOpUsagePeriod({
    clientId: clientId,
    from: range.from,
    to: range.to,
    period: intervalType,
  });

  return (
    <div>
      <div className="flex justify-end gap-3">
        <DateRangeSelector
          range={range}
          setRange={(newRange) => {
            setRange(newRange);
            const days = differenceInDays(newRange.to, newRange.from);
            setIntervalType(days > 30 ? "week" : "day");
          }}
        />
        <IntervalSelector
          intervalType={intervalType}
          setIntervalType={setIntervalType}
        />
      </div>

      <div className="h-6" />

      <div className="flex flex-col gap-4 lg:gap-6">
        <TotalSponsoredChartCard
          userOpStats={userOpUsageQuery.data || []}
          isPending={userOpUsageQuery.isPending}
        />

        <SponsoredTransactionsChartCard
          userOpStats={userOpUsageQuery.data || []}
          isPending={userOpUsageQuery.isPending}
        />
      </div>
    </div>
  );
}
