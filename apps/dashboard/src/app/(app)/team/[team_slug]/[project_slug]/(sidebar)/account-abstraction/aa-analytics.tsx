"use client";
import { differenceInDays } from "date-fns";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  DateRangeSelector,
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { IntervalSelector } from "@/components/analytics/interval-selector";
import { SponsoredTransactionsTable } from "@/components/sponsored-transactions-table/SponsoredTransactionsTable";
import type { UserOpStats } from "@/types/analytics";
import { GasMetricsChartCard } from "./AccountAbstractionAnalytics/GasMetricsChartCard";
import { TotalSponsoredChartCard } from "./AccountAbstractionAnalytics/TotalSponsoredChartCard";
import { searchParams } from "./search-params";

type AccountAbstractionAnalyticsProps = {
  userOpStats: UserOpStats[];
  teamId: string;
  teamSlug: string;
  client: ThirdwebClient;
} & (
  | {
      variant: "project";
      projectId: string;
    }
  | {
      variant: "team";
      projects: {
        id: string;
        name: string;
        image: string | null;
        slug: string;
      }[];
    }
);

export function AccountAbstractionAnalytics(
  props: AccountAbstractionAnalyticsProps,
) {
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
  const resolvedFrom = range.from;
  const resolvedTo = range.to;

  return (
    <div>
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
          isPending={isLoading}
          userOpStats={props.userOpStats}
        />

        <GasMetricsChartCard
          isPending={isLoading}
          userOpStats={props.userOpStats}
        />

        {resolvedFrom && resolvedTo && (
          <SponsoredTransactionsTable
            client={props.client}
            from={resolvedFrom.toISOString()}
            teamId={props.teamId}
            teamSlug={props.teamSlug}
            to={resolvedTo.toISOString()}
            {...(props.variant === "project"
              ? { projectId: props.projectId, variant: "project" as const }
              : { projects: props.projects, variant: "team" as const })}
          />
        )}
      </div>
    </div>
  );
}
