"use client";

import type { Project } from "@/api/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { PaginationButtons } from "@/components/pagination-buttons";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { format } from "date-fns/format";
import { useAllChainsData } from "hooks/chains/allChains";
import { ExternalLinkIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ChainIconClient } from "../../../../../../../components/icons/ChainIcon";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import type {
  Transaction,
  TransactionStatus,
  TransactionsResponse,
} from "./types";

// TODO - add Status selector dropdown here
export function TransactionsTableUI(props: {
  getData: (params: { page: number }) => Promise<TransactionsResponse>;
  project: Project;
  wallets?: Wallet[];
}) {
  const router = useDashboardRouter();
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const transactionsQuery = useQuery({
    queryKey: ["transactions", props.project.id, page],
    queryFn: () => props.getData({ page }),
    refetchInterval: autoUpdate ? 4_000 : false,
    placeholderData: keepPreviousData,
    enabled: !!props.wallets && props.wallets.length > 0,
  });

  const transactions = transactionsQuery.data?.transactions ?? [];

  const totalCount = transactionsQuery.data?.pagination.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalCount > pageSize;

  const showSkeleton =
    (transactionsQuery.isPlaceholderData && transactionsQuery.isFetching) ||
    (transactionsQuery.isLoading && !transactionsQuery.isPlaceholderData);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-4 rounded-lg rounded-b-none px-6 py-6 lg:flex-row lg:justify-between">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">
            Transaction History
          </h2>
          <p className="text-muted-foreground text-sm">
            Transactions sent from server wallets
          </p>
        </div>

        <div className="flex items-center justify-end gap-5 border-border border-t pt-4 lg:border-none lg:pt-0">
          <div className="flex shrink-0 items-center gap-2">
            <Label htmlFor="auto-update">Auto Update</Label>
            <Switch
              checked={autoUpdate}
              onCheckedChange={(v) => setAutoUpdate(!!v)}
              id="auto-update"
            />
          </div>
          <StatusSelector
            status={status}
            setStatus={(v) => {
              setStatus(v);
              // reset page
              setPage(1);
            }}
          />
        </div>
      </div>

      <TableContainer className="rounded-none border-x-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Queue ID</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Tx Hash</TableHead>
              <TableHead>Queued</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showSkeleton ? (
              <>
                {new Array(pageSize).fill(0).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <SkeletonRow key={i} />
                ))}
              </>
            ) : (
              <>
                {transactions.map((tx) => (
                  <TableRow
                    key={`${tx.id}${tx.chainId}`}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => {
                      router.push(`engine/tx/${tx.id}`);
                    }}
                  >
                    {/* Queue ID */}
                    <TableCell className="font-medium">
                      <CopyAddressButton
                        address={tx.id ? tx.id : ""}
                        copyIconPosition="left"
                        variant="ghost"
                        className="text-muted-foreground"
                      />
                    </TableCell>

                    {/* Chain Id */}
                    <TableCell>
                      <TxChainCell chainId={tx.chainId || undefined} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <TxStatusCell transaction={tx} />
                    </TableCell>

                    {/* From Address */}
                    <TableCell>
                      {tx.from ? <WalletAddress address={tx.from} /> : "N/A"}
                    </TableCell>

                    {/* Tx Hash */}
                    <TableCell>
                      <TxHashCell transaction={tx} />
                    </TableCell>

                    {/* Queued At */}
                    <TableCell>
                      <TxQueuedAtCell transaction={tx} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>

        {!showSkeleton && transactions.length === 0 && (
          <div className="flex min-h-[200px] items-center justify-center">
            No transactions found
          </div>
        )}
      </TableContainer>

      {showPagination && (
        <div className="py-6">
          <PaginationButtons
            activePage={page}
            onPageClick={setPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

const statusDetails = {
  QUEUED: {
    name: "Queued",
    type: "warning",
  },
  SUBMITTED: {
    name: "Submitted",
    type: "warning",
  },
  CONFIRMED: {
    name: "Confirmed",
    type: "success",
  },
  REVERTED: {
    name: "Reverted",
    type: "destructive",
  },
} as const;

function StatusSelector(props: {
  status: TransactionStatus | undefined;
  setStatus: (value: TransactionStatus | undefined) => void;
}) {
  const statuses = Object.keys(statusDetails) as TransactionStatus[];

  return (
    <Select
      value={props.status || "all"}
      onValueChange={(v) => {
        if (v === "all") {
          props.setStatus(undefined);
        } else {
          props.setStatus(v as TransactionStatus);
        }
      }}
    >
      <SelectTrigger className="min-w-[160px]">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All Transactions</SelectItem>
          {statuses.map((item) => {
            return (
              <SelectItem key={item} value={item}>
                {statusDetails[item].name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function SkeletonRow() {
  return (
    <TableRow className="h-[73px]">
      <TableCell>
        <Skeleton className="h-6 w-[152px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-[155px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-[58px] rounded-full" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-[145px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-[160px]" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-[108px]" />
      </TableCell>
    </TableRow>
  );
}

function TxChainCell(props: { chainId: string | undefined }) {
  const { chainId } = props;
  const { idToChain } = useAllChainsData();
  const thirdwebClient = useThirdwebClient();
  if (!chainId) {
    return "N/A";
  }

  const chain = idToChain.get(Number.parseInt(chainId));

  if (!chain) {
    return `Chain ID: ${chainId}`;
  }

  return (
    <div className="flex items-center gap-2">
      <ChainIconClient
        className="size-5"
        client={thirdwebClient}
        src={chain.icon?.url}
      />
      <div className="max-w-[150px] truncate">
        {chain.name ?? `Chain ID: ${chainId}`}
      </div>
    </div>
  );
}

function TxStatusCell(props: { transaction: Transaction }) {
  const { transaction } = props;
  const { errorMessage } = transaction;
  const minedAt = transaction.confirmedAt;
  const status =
    (transaction.executionResult?.status as TransactionStatus) ?? null;

  const onchainStatus =
    transaction.executionResult &&
    "onchainStatus" in transaction.executionResult
      ? transaction.executionResult.onchainStatus
      : null;

  if (!status) {
    return null;
  }

  const tooltip =
    onchainStatus !== "REVERTED"
      ? errorMessage
      : status === "CONFIRMED" && minedAt
        ? `Completed ${format(new Date(minedAt), "PP pp")}`
        : undefined;

  return (
    <ToolTipLabel hoverable label={tooltip}>
      <Badge variant={statusDetails[status].type} className="gap-2">
        {statusDetails[status].name}
        {errorMessage && <InfoIcon className="size-3" />}
      </Badge>
    </ToolTipLabel>
  );
}

function TxHashCell(props: { transaction: Transaction }) {
  const { idToChain } = useAllChainsData();
  const { chainId, transactionHash } = props.transaction;
  if (!transactionHash) {
    return "N/A";
  }

  const chain = chainId ? idToChain.get(Number.parseInt(chainId)) : undefined;
  const explorer = chain?.explorers?.[0];

  const shortHash = `${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`;
  if (!explorer) {
    return (
      <CopyTextButton
        textToCopy={transactionHash}
        copyIconPosition="left"
        textToShow={shortHash}
        variant="ghost"
        tooltip="Copy transaction hash"
        className="font-mono text-muted-foreground text-sm"
      />
    );
  }

  return (
    <Button
      variant="ghost"
      asChild
      className="-translate-x-2 gap-2 font-mono"
      size="sm"
    >
      <Link
        href={`${explorer.url}/tx/${transactionHash}`}
        target="_blank"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {shortHash}{" "}
        <ExternalLinkIcon className="size-4 text-muted-foreground" />
      </Link>
    </Button>
  );
}

function TxQueuedAtCell(props: { transaction: Transaction }) {
  const value = props.transaction.createdAt;
  if (!value) {
    return;
  }

  const date = new Date(value);
  return (
    <ToolTipLabel label={format(date, "PP pp z")}>
      <p>{formatDistanceToNowStrict(date, { addSuffix: true })}</p>
    </ToolTipLabel>
  );
}
