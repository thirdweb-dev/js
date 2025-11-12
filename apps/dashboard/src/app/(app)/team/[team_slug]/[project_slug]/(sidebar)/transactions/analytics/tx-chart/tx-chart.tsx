"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Project } from "@/api/project/projects";
import {
  DateRangeSelector,
  getLastNDaysRange,
} from "@/components/analytics/date-range-selector";
import { IntervalSelector } from "@/components/analytics/interval-selector";
import { normalizeTimeISOString } from "@/lib/time";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import { TransactionAnalyticsSummary } from "../summary";
import { getTransactionsChartData } from "./data";
import { TransactionsChartCardUI } from "./tx-chart-ui";

export function TransactionsAnalytics(props: {
  project: Project;
  wallets: Wallet[];
  authToken: string;
  teamSlug: string;
}) {
  const [range, setRange] = useState(() => getLastNDaysRange("last-30"));
  const [interval, setInterval] = useState<"day" | "week">("day");

  const normalizedFrom = normalizeTimeISOString(range.from);
  const normalizedTo = normalizeTimeISOString(range.to);

  const params = {
    clientId: props.project.publishableKey,
    from: normalizedFrom,
    interval: interval,
    teamId: props.project.teamId,
    to: normalizedTo,
    authToken: props.authToken,
  };

  const engineTxAnalytics = useQuery({
    queryKey: ["engine-tx-analytics", params],
    queryFn: async () => {
      const data = await getTransactionsChartData(params);
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <div className="no-scrollbar flex items-center gap-3 max-sm:overflow-auto">
          <DateRangeSelector
            popoverAlign="end"
            range={range}
            setRange={setRange}
          />

          <IntervalSelector
            intervalType={interval}
            setIntervalType={setInterval}
          />
        </div>
      </div>
      <TransactionAnalyticsSummary
        authToken={props.authToken}
        clientId={props.project.publishableKey}
        teamId={props.project.teamId}
        startDate={normalizedFrom}
        endDate={normalizedTo}
      />
      <TransactionsChartCardUI
        isPending={engineTxAnalytics.isPending}
        project={props.project}
        teamSlug={props.teamSlug}
        userOpStats={engineTxAnalytics.data ?? []}
        wallets={props.wallets}
      />
    </div>
  );
}
