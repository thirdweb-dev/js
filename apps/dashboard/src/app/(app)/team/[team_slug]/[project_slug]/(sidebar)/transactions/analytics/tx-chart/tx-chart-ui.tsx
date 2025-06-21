"use client";

import { format } from "date-fns";
import { useAllChainsData } from "hooks/chains/allChains";
import { formatTickerNumber } from "lib/format-utils";
import Link from "next/link";
import { useMemo } from "react";
import type { TransactionStats } from "types/analytics";
import type { Project } from "@/api/projects";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Wallet } from "../../server-wallets/wallet-table/types";

type ChartData = Record<string, number> & {
  time: string;
};

// TODO: write a story for this component when its finalized
export function TransactionsChartCardUI(props: {
  userOpStats: TransactionStats[];
  isPending: boolean;
  project: Project;
  wallets: Wallet[];
  teamSlug: string;
}) {
  const { userOpStats } = props;
  const topChainsToShow = 10;
  const chainsStore = useAllChainsData();

  // TODO - update this if we need to change it
  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {};
    const _chartDataMap: Map<string, ChartData> = new Map();
    const chainIdToVolumeMap: Map<string, number> = new Map();
    // for each stat, add it in _chartDataMap
    for (const stat of userOpStats) {
      const chartData = _chartDataMap.get(stat.date);
      const { chainId } = stat;
      const chain = chainsStore.idToChain.get(Number(chainId));

      const chainName = chain?.name || chainId.toString() || "Unknown";
      // if no data for current day - create new entry
      if (!chartData) {
        _chartDataMap.set(stat.date, {
          time: stat.date,
          [chainName]: stat.count,
        } as ChartData);
      } else {
        chartData[chainName] = (chartData[chainName] || 0) + stat.count;
      }

      chainIdToVolumeMap.set(
        chainName,
        stat.count + (chainIdToVolumeMap.get(chainName) || 0),
      );
    }

    const chainsSorted = Array.from(chainIdToVolumeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((w) => w[0]);

    const chainsToShow = chainsSorted.slice(0, topChainsToShow);
    const chainsToTagAsOthers = chainsSorted.slice(topChainsToShow);

    // replace chainIdsToTagAsOther chainId with "other"
    for (const data of _chartDataMap.values()) {
      for (const chainId in data) {
        if (chainsToTagAsOthers.includes(chainId)) {
          data.others = (data.others || 0) + (data[chainId] || 0);
          delete data[chainId];
        }
      }
    }

    chainsToShow.forEach((chainName, i) => {
      _chartConfig[chainName] = {
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
        label: chainName,
      };
    });

    // Add Other
    chainsToShow.push("others");
    _chartConfig.others = {
      color: "hsl(var(--muted-foreground))",
      label: "Others",
    };

    return {
      chartConfig: _chartConfig,
      chartData: Array.from(_chartDataMap.values()),
    };
  }, [userOpStats, chainsStore]);

  const uniqueChainIds = Object.keys(chartConfig);
  const disableActions =
    props.isPending ||
    chartData.length === 0 ||
    chartData.every((data) => data.transactions === 0);

  return (
    <ThirdwebBarChart
      chartClassName="aspect-[1.5] lg:aspect-[3.5]"
      config={chartConfig}
      customHeader={
        <div className="relative px-6 pt-6">
          <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
            Daily Transactions
          </h3>
          <p className="text-muted-foreground text-sm">
            Amount of daily transactions by chain.
          </p>

          <div className="top-6 right-6 mb-8 grid grid-cols-2 items-center gap-2 md:absolute md:mb-0 md:flex">
            <ExportToCSVButton
              className="bg-background"
              disabled={disableActions}
              fileName="Sponsored Transactions"
              getData={async () => {
                const header = ["Date", ...uniqueChainIds];
                const rows = chartData.map((data) => {
                  const { time, ...rest } = data;
                  return [
                    time,
                    ...uniqueChainIds.map((w) => (rest[w] || 0).toString()),
                  ];
                });
                return { header, rows };
              }}
            />
          </div>
        </div>
      }
      data={chartData}
      emptyChartState={
        <EmptyChartContent
          project={props.project}
          teamSlug={props.teamSlug}
          wallets={props.wallets}
        />
      }
      hideLabel={false}
      isPending={props.isPending}
      showLegend
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as number;
          return format(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
      toolTipValueFormatter={(value) => formatTickerNumber(Number(value))}
    />
  );
}

// TODO - update the title and doc links
function EmptyChartContent(props: {
  project: Project;
  teamSlug: string;
  wallets: Wallet[];
}) {
  const router = useDashboardRouter();
  return (
    <div className="flex flex-col items-center justify-center px-4">
      {props.wallets.length === 0 ? (
        <>
          <span className="mb-6 text-center text-lg">
            Engine requires a{" "}
            <Link
              className="underline"
              href="https://portal.thirdweb.com/vault"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vault admin account
            </Link>
            . Create one to get started.
          </span>
          <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Button
              onClick={() => {
                router.push(
                  `/team/${props.teamSlug}/${props.project.slug}/vault`,
                );
              }}
              variant="primary"
            >
              Create Vault Admin Account
            </Button>
          </div>
        </>
      ) : (
        <p className="flex items-center gap-2 rounded-full border bg-background px-3.5 py-1.5 text-sm">
          <span className="!pointer-events-auto relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Waiting for transactions...
        </p>
      )}
    </div>
  );
}
