"use client";

import { format, formatDistance } from "date-fns";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  DateRangeSelector,
  type Range,
} from "@/components/analytics/date-range-selector";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";
import { cn } from "@/lib/utils";
import {
  useFleetTransactions,
  useFleetTransactionsSummary,
} from "../lib/hooks";
import type { Fleet, FleetTransaction } from "../types";

type DedicatedRelayerActiveStateProps = {
  fleet: Fleet;
  teamId: string;
  fleetId: string;
  client: ThirdwebClient;
  range: Range;
  setRange: (range: Range) => void;
  className?: string;
};

export function DedicatedRelayerActiveState(
  props: DedicatedRelayerActiveStateProps,
) {
  const { fleet, teamId, fleetId, client, range, setRange } = props;

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [chainIdFilter, setChainIdFilter] = useState<number | undefined>();

  const summaryQuery = useFleetTransactionsSummary({
    teamId,
    fleetId,
    from: range.from.toISOString(),
    to: range.to.toISOString(),
  });

  const transactionsQuery = useFleetTransactions({
    teamId,
    fleetId,
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    chainId: chainIdFilter,
  });

  const totalPages = transactionsQuery.data
    ? Math.ceil(transactionsQuery.data.meta.total / pageSize)
    : 0;

  // Filter active chains to only include those in the fleet
  const activeChainsCount =
    summaryQuery.data?.data.transactionsByChain.filter((c) =>
      fleet.chainIds.includes(Number(c.chainId)),
    ).length ?? 0;

  return (
    <div className={cn("flex flex-col gap-6", props.className)}>
      <div className="flex justify-end">
        <DateRangeSelector range={range} setRange={setRange} />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Transactions"
          value={
            summaryQuery.data?.data.totalTransactions.toLocaleString() ?? "—"
          }
          isLoading={summaryQuery.isPending}
        />
        <StatCard
          title="Total Gas Spent"
          value={
            summaryQuery.data?.data.totalGasSpentUsd !== undefined
              ? `$${summaryQuery.data.data.totalGasSpentUsd.toFixed(2)}`
              : "—"
          }
          isLoading={summaryQuery.isPending}
        />
        <StatCard
          title="Active Chains"
          value={summaryQuery.data ? activeChainsCount.toString() : "—"}
          isLoading={summaryQuery.isPending}
        />
      </div>

      {/* Configuration Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Executors */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-4 lg:px-6">
            <h2 className="font-semibold text-xl tracking-tight">Executors</h2>
          </div>
          <div className="p-4 lg:p-6">
            <div className="flex flex-wrap gap-2">
              {fleet.executors.map((address) => (
                <div
                  key={address}
                  className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2"
                >
                  <WalletAddress address={address} client={client} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chains */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-4 lg:px-6">
            <h2 className="font-semibold text-xl tracking-tight">Chains</h2>
          </div>
          <div className="p-4 lg:p-6">
            <div className="flex flex-wrap gap-2">
              {fleet.chainIds.map((chainId) => (
                <div
                  key={chainId}
                  className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2"
                >
                  <ChainCell chainId={chainId.toString()} client={client} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex flex-col justify-between gap-3 border-b px-4 py-4 lg:flex-row lg:items-center lg:px-6">
          <h2 className="font-semibold text-xl">Transaction History</h2>
          <div className="flex gap-2">
            <ChainFilter
              chainId={chainIdFilter}
              setChainId={(chainId) => {
                setChainIdFilter(chainId);
                setPage(1);
              }}
              client={client}
              chainIds={fleet.chainIds}
            />
          </div>
        </div>

        <TableContainer className="rounded-none border-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Chain</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!transactionsQuery.isPending
                ? transactionsQuery.data?.data.map((tx) => (
                    <TransactionRow
                      key={tx.transactionHash}
                      transaction={tx}
                      client={client}
                    />
                  ))
                : Array.from({ length: pageSize }).map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no unique id
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!transactionsQuery.isPending &&
          (transactionsQuery.isError ? (
            <div className="px-6 py-24">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full border p-2">
                  <XIcon className="size-5" />
                </div>
              </div>
              <p className="text-center text-destructive-text text-sm">
                Failed to load transactions
              </p>
            </div>
          ) : transactionsQuery.data?.data.length === 0 ? (
            <div className="px-6 py-24">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full border p-2">
                  <XIcon className="size-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-center text-muted-foreground text-sm">
                No transactions yet
              </p>
            </div>
          ) : null)}

        {totalPages > 1 && (
          <div className="flex justify-end gap-3 rounded-b-lg border-t p-4">
            <PaginationButtons
              activePage={page}
              onPageClick={setPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard(props: {
  title: string;
  value: string;
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-muted-foreground text-sm">{props.title}</p>
      {props.isLoading ? (
        <Skeleton className="mt-1 h-8 w-24" />
      ) : (
        <p className="font-semibold text-2xl">{props.value}</p>
      )}
    </div>
  );
}

function TransactionRow(props: {
  transaction: FleetTransaction;
  client: ThirdwebClient;
}) {
  const { transaction, client } = props;
  const utcTimestamp = transaction.timestamp.endsWith("Z")
    ? transaction.timestamp
    : `${transaction.timestamp}Z`;

  return (
    <TableRow>
      <TableCell>
        <TransactionHashCell
          chainId={transaction.chainId}
          hash={transaction.transactionHash}
        />
      </TableCell>
      <TableCell>
        <ChainCell chainId={transaction.chainId} client={client} />
      </TableCell>
      <TableCell>
        <WalletAddress address={transaction.walletAddress} client={client} />
      </TableCell>
      <TableCell>
        <ToolTipLabel hoverable label={format(new Date(utcTimestamp), "PPpp")}>
          <span>
            {formatDistance(new Date(utcTimestamp), new Date(), {
              addSuffix: true,
            })}
          </span>
        </ToolTipLabel>
      </TableCell>
      <TableCell>
        <TransactionFeeCell usdValue={transaction.transactionFeeUsd} />
      </TableCell>
    </TableRow>
  );
}

function SkeletonRow() {
  return (
    <TableRow className="h-[72.5px]">
      <TableCell>
        <Skeleton className="h-7 w-[160px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-[130px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-[130px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-[40px]" />
      </TableCell>
    </TableRow>
  );
}

function TransactionHashCell(props: { hash: string; chainId: string }) {
  const txHashToShow = `${props.hash.slice(0, 6)}...${props.hash.slice(-4)}`;

  return (
    <Button asChild size="sm" variant="ghost">
      <Link
        className="-translate-x-2 gap-2 font-mono"
        href={`https://thirdweb.com/${props.chainId}/tx/${props.hash}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {txHashToShow}
        <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
      </Link>
    </Button>
  );
}

function ChainCell(props: { chainId: string; client: ThirdwebClient }) {
  const { idToChain, allChains } = useAllChainsData();
  const chain = idToChain.get(Number(props.chainId));

  if (allChains.length === 0) {
    return <Skeleton className="w-[100px]" />;
  }

  return (
    <div className="relative flex w-max items-center gap-2">
      <ChainIconClient
        className="size-6"
        client={props.client}
        src={chain?.icon?.url}
      />
      <Link
        className="before:absolute before:inset-0 hover:underline hover:underline-offset-4"
        href={`/${chain ? chain.slug : props.chainId}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {chain ? chain.name : `Chain #${props.chainId}`}
      </Link>
    </div>
  );
}

function TransactionFeeCell(props: { usdValue: number | null }) {
  if (props.usdValue === null) {
    return <span className="font-mono text-sm text-muted-foreground">—</span>;
  }
  return (
    <span className="font-mono text-sm">
      {props.usdValue < 0.001 ? "< $0.001" : `$${props.usdValue.toFixed(3)}`}
    </span>
  );
}

function ChainFilter(props: {
  chainId: number | undefined;
  setChainId: (chainId: number | undefined) => void;
  client: ThirdwebClient;
  chainIds: number[];
}) {
  return (
    <div className="flex bg-background">
      <SingleNetworkSelector
        client={props.client}
        chainId={props.chainId}
        onChange={(chainId) => props.setChainId(chainId)}
        popoverContentClassName="z-[10001] !w-[280px]"
        align="end"
        placeholder="All Chains"
        className="min-w-[150px]"
        chainIds={props.chainIds}
      />
    </div>
  );
}
