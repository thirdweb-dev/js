"use client";
import {
  DateRangeSelector,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import { differenceInDays } from "date-fns";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { UserOpStats } from "types/analytics";
import { SponsoredTransactionsTable } from "../../../app/team/[team_slug]/(team)/~/usage/overview/components/SponsoredTransactionsTable";
import { searchParams } from "../../../app/team/[team_slug]/[project_slug]/connect/account-abstraction/search-params";
import { AccountAbstractionSummary } from "./AccountAbstractionSummary";
import { SponsoredTransactionsChartCard } from "./SponsoredTransactionsChartCard";
import { TotalSponsoredChartCard } from "./TotalSponsoredChartCard";

export function AccountAbstractionAnalytics(props: {
  userOpStats: UserOpStats[];
  teamId: string;
  teamSlug: string;
  client: ThirdwebClient;
  projectId: string;
  aggregateUserOpStats: UserOpStats;
}) {
  const [isLoading, startTransition] = useTransition();

  const [rangeType, setRangeType] = useQueryState(
    "range",
    searchParams.range.withOptions({
      history: "push",
      shallow: false,
      startTransition,
    }),
  );
  const [intervalType, setIntervalType] = useQueryState<"day" | "week">(
    "interval",
    searchParams.interval.withOptions({
      history: "push",
      shallow: false,
      startTransition,
    }),
  );
  const [from, setFrom] = useQueryState(
    "from",
    searchParams.from.withOptions({
      history: "push",
      shallow: false,
      startTransition,
    }),
  );
  const [to, setTo] = useQueryState(
    "to",
    searchParams.to.withOptions({
      history: "push",
      shallow: false,
      startTransition,
    }),
  );

  const range: Range = {
    from: rangeType === "custom" ? from : getLastNDaysRange(rangeType).from,
    to: rangeType === "custom" ? to : getLastNDaysRange(rangeType).to,
    type: rangeType,
  };

  return (
    <div>
      <AccountAbstractionSummary
        aggregateUserOpUsageQuery={props.aggregateUserOpStats}
      />

      <div className="h-10" />

      <div className="flex justify-end gap-3">
        <DateRangeSelector
          range={range}
          setRange={(newRange) => {
            // if the new range is "custom", set to and from
            if (newRange.type === "custom") {
              setFrom(newRange.from);
              setTo(newRange.to);
            } else {
              // otherwise delete to and from -> set range type only
              setFrom(null);
              setTo(null);
            }

            // set the range type (always)
            setRangeType(newRange.type);
            // also update interval type based on the new range
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
          userOpStats={props.userOpStats}
          isPending={isLoading}
        />

        <SponsoredTransactionsChartCard
          userOpStats={props.userOpStats}
          isPending={isLoading}
        />

        <SponsoredTransactionsTable
          client={props.client}
          teamId={props.teamId}
          from={from.toISOString()}
          to={to.toISOString()}
          variant="project"
          projectId={props.projectId}
          teamSlug={props.teamSlug}
        />
      </div>
    </div>
  );
}
