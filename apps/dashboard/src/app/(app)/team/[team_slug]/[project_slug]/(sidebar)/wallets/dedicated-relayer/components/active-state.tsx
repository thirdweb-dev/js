"use client";

import {
  ActivityIcon,
  CheckCircle2Icon,
  CoinsIcon,
  WalletIcon,
} from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { toEther } from "thirdweb/utils";
import type { Project } from "@/api/project/projects";
import {
  DateRangeSelector,
  getLastNDaysRange,
} from "@/components/analytics/date-range-selector";
import { StatCard } from "@/components/analytics/stat";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defineDashboardChain } from "@/lib/defineDashboardChain";
import { normalizeTimeISOString } from "@/lib/time";
import { useFleetAnalytics } from "../lib/hooks";
import type { Fleet } from "../types";

type DedicatedRelayerActiveStateProps = {
  fleet: Fleet;
  project: Project;
  authToken: string;
  teamSlug: string;
  client: ThirdwebClient;
};

/**
 * Active state shown when fleet is fully set up with executors.
 * Shows executor addresses, analytics, and transaction stats.
 */
export function DedicatedRelayerActiveState(
  props: DedicatedRelayerActiveStateProps,
) {
  const { fleet, project } = props;

  const [range, setRange] = useState(() => getLastNDaysRange("last-30"));

  const normalizedFrom = normalizeTimeISOString(range.from);
  const normalizedTo = normalizeTimeISOString(range.to);

  const analyticsQuery = useFleetAnalytics({
    teamId: project.teamId,
    projectId: project.id,
    authToken: props.authToken,
    startDate: normalizedFrom,
    endDate: normalizedTo,
  });

  // Group executors by chain
  const executorsByChain = fleet.executors.reduce(
    (acc, executor) => {
      if (!acc[executor.chainId]) {
        acc[executor.chainId] = [];
      }
      acc[executor.chainId]?.push(executor.address);
      return acc;
    },
    {} as Record<number, string[]>,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Status Banner */}
      <div className="flex items-center gap-3 rounded-lg border border-success/50 bg-success/10 px-4 py-3">
        <CheckCircle2Icon className="size-5 text-success" />
        <div>
          <p className="font-medium text-success">
            Dedicated relayer is active
          </p>
          <p className="text-muted-foreground text-sm">
            Your transactions are being relayed through dedicated executors.
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex justify-start">
        <DateRangeSelector range={range} setRange={setRange} />
      </div>

      {/* Summary Stats */}
      <FleetAnalyticsSummary
        data={analyticsQuery.data}
        isPending={analyticsQuery.isPending}
      />

      {/* Executor Wallets */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-4 lg:px-6">
          <h2 className="font-semibold text-xl tracking-tight">
            Executor Wallets
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Dedicated wallets relaying your transactions
          </p>
        </div>

        <div className="p-4 lg:p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chain</TableHead>
                <TableHead>Executor Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(executorsByChain).map(([chainId, addresses]) =>
                addresses.map((address, idx) => {
                  const chain = defineDashboardChain(
                    Number(chainId),
                    undefined,
                  );
                  return (
                    <TableRow key={`${chainId}-${address}`}>
                      <TableCell>
                        <span className="font-medium">
                          {chain.name || `Chain ${chainId}`}
                        </span>
                        {idx === 0 && addresses.length > 1 && (
                          <span className="ml-2 text-muted-foreground text-xs">
                            ({addresses.length} executors)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <CopyAddressButton
                          address={address}
                          className="font-mono text-sm"
                          copyIconPosition="right"
                          variant="ghost"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="ghost">
                          <a
                            href={
                              chain.blockExplorers?.[0]?.url
                                ? `${chain.blockExplorers[0].url}/address/${address}`
                                : "#"
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            View on Explorer
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }),
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Supported Chains */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-4 lg:px-6">
          <h2 className="font-semibold text-xl tracking-tight">
            Supported Chains
          </h2>
        </div>

        <div className="p-4 lg:p-6">
          <div className="flex flex-wrap gap-2">
            {fleet.chainIds.map((chainId) => {
              const chain = defineDashboardChain(chainId, undefined);
              return (
                <span
                  key={chainId}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-sm"
                >
                  {chain.name || `Chain ${chainId}`}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FleetAnalyticsSummary(props: {
  data:
    | {
        totalTransactions: number;
        totalGasSpentWei: string;
        remainingBalanceWei: string;
      }
    | null
    | undefined;
  isPending: boolean;
}) {
  const formatWeiToEth = (weiString: string): number => {
    try {
      if (weiString === "0") return 0;
      const weiBigInt = BigInt(weiString);
      return Number.parseFloat(toEther(weiBigInt));
    } catch {
      return 0;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        icon={ActivityIcon}
        isPending={props.isPending}
        label="Total Transactions"
        value={props.data?.totalTransactions ?? 0}
      />
      <StatCard
        formatter={(v: number) => `${v.toFixed(6)} ETH`}
        icon={CoinsIcon}
        isPending={props.isPending}
        label="Total Gas Spent"
        value={formatWeiToEth(props.data?.totalGasSpentWei ?? "0")}
      />
      <StatCard
        formatter={(v: number) => `${v.toFixed(6)} ETH`}
        icon={WalletIcon}
        isPending={props.isPending}
        label="Remaining Balance"
        value={formatWeiToEth(props.data?.remainingBalanceWei ?? "0")}
      />
    </div>
  );
}
