"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ExternalLinkIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useId, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/project/projects";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { SolanaAddress } from "@/components/blocks/solana-address";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
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
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type {
  SolanaTransaction,
  SolanaTransactionStatus,
  SolanaTransactionsResponse,
} from "../analytics/solana-tx-table/types";
import type {
  Transaction,
  TransactionStatus,
  TransactionsResponse,
} from "../analytics/tx-table/types";
import { getSolanaNetworkName, getSolscanUrl } from "../lib/solana-utils";

type TransactionChain = "evm" | "solana";

interface UnifiedTransactionsTableProps {
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
}

export function UnifiedTransactionsTable({
  project,
  teamSlug,
  client,
}: UnifiedTransactionsTableProps) {
  const router = useDashboardRouter();

  // Use nuqs to manage chain selection in URL - this is the source of truth
  const [activeChainParam, setActiveChainParam] = useQueryState("txChain", {
    defaultValue: "evm",
    history: "push",
  });

  const activeChain = (activeChainParam || "evm") as TransactionChain;
  const setActiveChain = (chain: TransactionChain) =>
    setActiveChainParam(chain);

  const [autoUpdate, setAutoUpdate] = useState(true);
  const [status, setStatus] = useState<
    TransactionStatus | SolanaTransactionStatus | undefined
  >(undefined);
  const [id, setId] = useState<string | undefined>(undefined);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  // Fetch EVM transactions
  const evmTransactionsQuery = useQuery({
    enabled: activeChain === "evm",
    placeholderData: keepPreviousData,
    queryFn: () =>
      getEVMTransactions({
        page,
        project,
        status: status as TransactionStatus | undefined,
        id,
        from,
      }),
    queryKey: ["evm-transactions", project.id, page, status, id, from],
    refetchInterval: autoUpdate && activeChain === "evm" ? 4_000 : false,
  });

  // Fetch Solana transactions
  const solanaTransactionsQuery = useQuery({
    enabled: activeChain === "solana",
    placeholderData: keepPreviousData,
    queryFn: () =>
      getSolanaTransactions({
        page,
        project,
        status: status as SolanaTransactionStatus | undefined,
        id,
        from,
      }),
    queryKey: ["solana-transactions", project.id, page, status, id, from],
    refetchInterval: autoUpdate && activeChain === "solana" ? 4_000 : false,
  });

  const autoUpdateId = useId();

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Unified Header & Filters */}
      <div className="flex flex-col gap-4 rounded-lg rounded-b-none px-6 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Transaction History
            </h2>
            <p className="text-muted-foreground text-sm">
              Transactions sent from server wallets
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 border-border border-t pt-4 lg:border-none lg:pt-0">
            <Label htmlFor={autoUpdateId}>Auto Update</Label>
            <Switch
              checked={autoUpdate}
              id={autoUpdateId}
              onCheckedChange={(v) => setAutoUpdate(!!v)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <Input
            className="w-full sm:max-w-[200px]"
            onChange={(e) => {
              const value = e.target.value.trim();
              setId(value || undefined);
              setPage(1);
            }}
            placeholder="Filter by Queue ID"
            value={id || ""}
          />
          <Input
            className="w-full sm:max-w-[200px]"
            onChange={(e) => {
              const value = e.target.value.trim();
              setFrom(value || undefined);
              setPage(1);
            }}
            placeholder="Filter by wallet address"
            value={from || ""}
          />
          <div className="flex gap-3">
            <ChainSelector
              activeChain={activeChain}
              setActiveChain={(chain) => {
                setActiveChain(chain);
                setPage(1);
                setStatus(undefined);
              }}
            />
            <StatusSelector
              activeChain={activeChain}
              setStatus={(v) => {
                setStatus(v);
                setPage(1);
              }}
              status={status}
            />
          </div>
        </div>
      </div>

      {/* Render different table structures based on chain */}
      {activeChain === "evm" ? (
        <EVMTransactionsTable
          client={client}
          page={page}
          project={project}
          query={evmTransactionsQuery}
          router={router}
          setPage={setPage}
          teamSlug={teamSlug}
        />
      ) : (
        <SolanaTransactionsTable
          page={page}
          project={project}
          query={solanaTransactionsQuery}
          router={router}
          setPage={setPage}
          teamSlug={teamSlug}
        />
      )}
    </div>
  );
}

// EVM Transactions Table Component
function EVMTransactionsTable(props: {
  query: ReturnType<typeof useQuery<TransactionsResponse>>;
  page: number;
  setPage: (page: number) => void;
  client: ThirdwebClient;
  router: ReturnType<typeof useDashboardRouter>;
  teamSlug: string;
  project: Project;
}) {
  const { query, page, setPage, client, router, teamSlug, project } = props;
  const pageSize = 10;

  const transactions = query.data?.transactions ?? [];
  const totalCount = query.data?.pagination.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalCount > pageSize;

  const showSkeleton =
    (query.isPlaceholderData && query.isFetching) ||
    (query.isLoading && !query.isPlaceholderData);

  return (
    <>
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
            {showSkeleton
              ? new Array(pageSize).fill(0).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
                  <SkeletonRow key={i} />
                ))
              : transactions.map((tx) => (
                  <TableRow
                    className="cursor-pointer hover:bg-accent/50"
                    key={`${tx.id}${tx.chainId}`}
                    onClick={() => {
                      router.push(
                        `/team/${teamSlug}/${project.slug}/transactions/tx/${tx.id}`,
                      );
                    }}
                  >
                    <TableCell className="font-medium">
                      <CopyAddressButton
                        address={tx.id}
                        className="text-muted-foreground"
                        copyIconPosition="left"
                        variant="ghost"
                      />
                    </TableCell>
                    <TableCell>
                      <EVMChainCell
                        chainId={tx.chainId || undefined}
                        client={client}
                      />
                    </TableCell>
                    <TableCell>
                      <EVMStatusCell transaction={tx} />
                    </TableCell>
                    <TableCell>
                      {tx.from ? (
                        <WalletAddress address={tx.from} client={client} />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <EVMTxHashCell transaction={tx} />
                    </TableCell>
                    <TableCell>
                      <EVMQueuedAtCell transaction={tx} />
                    </TableCell>
                  </TableRow>
                ))}
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
    </>
  );
}

// Solana Transactions Table Component
function SolanaTransactionsTable(props: {
  query: ReturnType<typeof useQuery<SolanaTransactionsResponse>>;
  page: number;
  setPage: (page: number) => void;
  router: ReturnType<typeof useDashboardRouter>;
  teamSlug: string;
  project: Project;
}) {
  const { query, page, setPage, router, teamSlug, project } = props;
  const pageSize = 10;

  const transactions = query.data?.transactions ?? [];
  const totalCount = query.data?.pagination.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalCount > pageSize;

  const showSkeleton =
    (query.isPlaceholderData && query.isFetching) ||
    (query.isLoading && !query.isPlaceholderData);

  return (
    <>
      <TableContainer className="rounded-none border-x-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Queue ID</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signer</TableHead>
              <TableHead>Signature</TableHead>
              <TableHead>Queued</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showSkeleton
              ? new Array(pageSize).fill(0).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
                  <SkeletonRow key={i} />
                ))
              : transactions.map((tx) => (
                  <TableRow
                    className="cursor-pointer hover:bg-accent/50"
                    key={`${tx.id}${tx.chainId}`}
                    onClick={() => {
                      router.push(
                        `/team/${teamSlug}/${project.slug}/transactions/tx/${tx.id}`,
                      );
                    }}
                  >
                    <TableCell className="font-medium">
                      <CopyAddressButton
                        address={tx.id}
                        className="text-muted-foreground"
                        copyIconPosition="left"
                        variant="ghost"
                      />
                    </TableCell>
                    <TableCell>
                      <SolanaChainCell chainId={tx.chainId} />
                    </TableCell>
                    <TableCell>
                      <SolanaStatusCell transaction={tx} />
                    </TableCell>
                    <TableCell>
                      <SolanaAddress
                        address={tx.signerAddress}
                        shortenAddress={true}
                      />
                    </TableCell>
                    <TableCell>
                      <SolanaTxHashCell transaction={tx} />
                    </TableCell>
                    <TableCell>
                      <SolanaQueuedAtCell transaction={tx} />
                    </TableCell>
                  </TableRow>
                ))}
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
    </>
  );
}

// Chain selector component
function ChainSelector(props: {
  activeChain: TransactionChain;
  setActiveChain: (chain: TransactionChain) => void;
}) {
  return (
    <Select
      onValueChange={(v) => props.setActiveChain(v as TransactionChain)}
      value={props.activeChain}
    >
      <SelectTrigger className="min-w-[160px] rounded-full">
        <SelectValue placeholder="Select Chain" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="evm">EVM</SelectItem>
          <SelectItem value="solana">Solana</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// Status selector component
const evmStatusDetails = {
  CONFIRMED: { name: "Confirmed", type: "success" as const },
  FAILED: { name: "Failed", type: "destructive" as const },
  QUEUED: { name: "Queued", type: "warning" as const },
  SUBMITTED: { name: "Submitted", type: "warning" as const },
};

const solanaStatusDetails = {
  CONFIRMED: { name: "Confirmed", type: "success" as const },
  FAILED: { name: "Failed", type: "destructive" as const },
  QUEUED: { name: "Queued", type: "warning" as const },
  SUBMITTED: { name: "Submitted", type: "warning" as const },
};

function StatusSelector(props: {
  activeChain: TransactionChain;
  status: TransactionStatus | SolanaTransactionStatus | undefined;
  setStatus: (
    value: TransactionStatus | SolanaTransactionStatus | undefined,
  ) => void;
}) {
  const statusDetails =
    props.activeChain === "evm" ? evmStatusDetails : solanaStatusDetails;
  const statuses = Object.keys(statusDetails) as (
    | TransactionStatus
    | SolanaTransactionStatus
  )[];

  return (
    <Select
      onValueChange={(v) => {
        if (v === "all") {
          props.setStatus(undefined);
        } else {
          props.setStatus(v as TransactionStatus | SolanaTransactionStatus);
        }
      }}
      value={props.status || "all"}
    >
      <SelectTrigger className="min-w-[160px] rounded-full">
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

// Skeleton row component
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

// EVM Chain cell component
function EVMChainCell(props: {
  chainId: string | undefined;
  client: ThirdwebClient;
}) {
  const { chainId } = props;
  const { idToChain } = useAllChainsData();
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
        client={props.client}
        src={chain.icon?.url}
      />
      <div className="max-w-[150px] truncate">
        {chain.name ?? `Chain ID: ${chainId}`}
      </div>
    </div>
  );
}

// Solana Chain cell component
function SolanaChainCell(props: { chainId: string | undefined }) {
  const { chainId } = props;
  if (!chainId) {
    return "N/A";
  }

  const network = getSolanaNetworkName(chainId);
  const displayName = network.charAt(0).toUpperCase() + network.slice(1);

  return (
    <div className="flex items-center gap-2">
      <div className="size-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
      <span>Solana {displayName}</span>
    </div>
  );
}

// EVM Status cell component
function EVMStatusCell(props: { transaction: Transaction }) {
  const { transaction } = props;
  const { errorMessage } = transaction;
  const minedAt = transaction.confirmedAt;
  const status =
    (transaction.executionResult?.status as TransactionStatus) ?? "QUEUED";

  const onchainStatus =
    transaction.executionResult &&
    "onchainStatus" in transaction.executionResult
      ? transaction.executionResult.onchainStatus
      : null;

  const tooltip =
    onchainStatus !== "REVERTED"
      ? errorMessage
      : status === "CONFIRMED" && minedAt
        ? `Completed ${format(new Date(minedAt), "PP pp")}`
        : undefined;

  const statusDetails = evmStatusDetails[status] || {
    name: status,
    type: "default" as const,
  };

  return (
    <ToolTipLabel hoverable label={tooltip}>
      <Badge className="gap-2" variant={statusDetails.type}>
        {statusDetails.name}
        {errorMessage && <InfoIcon className="size-3" />}
      </Badge>
    </ToolTipLabel>
  );
}

// Solana Status cell component
function SolanaStatusCell(props: { transaction: SolanaTransaction }) {
  const { transaction } = props;
  const { errorMessage } = transaction;
  const status =
    (transaction.executionResult?.status as SolanaTransactionStatus) ??
    transaction.status ??
    "QUEUED";

  const onchainStatus =
    transaction.executionResult &&
    "onchainStatus" in transaction.executionResult
      ? transaction.executionResult.onchainStatus
      : null;

  const tooltip =
    onchainStatus !== "REVERTED"
      ? errorMessage
      : status === "CONFIRMED" && transaction.confirmedAt
        ? `Completed ${format(new Date(transaction.confirmedAt), "PP pp")}`
        : undefined;

  const statusDetails = solanaStatusDetails[status] || {
    name: status || "QUEUED",
    type: "default" as const,
  };

  return (
    <ToolTipLabel hoverable label={tooltip}>
      <Badge className="gap-2" variant={statusDetails.type}>
        {statusDetails.name}
        {errorMessage && <InfoIcon className="size-3" />}
      </Badge>
    </ToolTipLabel>
  );
}

// EVM Tx Hash cell component
function EVMTxHashCell(props: { transaction: Transaction }) {
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
        className="font-mono text-muted-foreground text-sm"
        copyIconPosition="left"
        textToCopy={transactionHash}
        textToShow={shortHash}
        tooltip="Copy transaction hash"
        variant="ghost"
      />
    );
  }

  return (
    <Button
      asChild
      className="-translate-x-2 gap-2 font-mono"
      size="sm"
      variant="ghost"
    >
      <Link
        href={`${explorer.url}/tx/${transactionHash}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        rel="noopener noreferrer"
        target="_blank"
      >
        {shortHash}{" "}
        <ExternalLinkIcon className="size-4 text-muted-foreground" />
      </Link>
    </Button>
  );
}

// Solana Tx Hash cell component
function SolanaTxHashCell(props: { transaction: SolanaTransaction }) {
  const { chainId, signature, executionResult } = props.transaction;

  // Get signature from executionResult if available, otherwise use top-level signature
  let hash = signature;
  if (
    executionResult &&
    "signature" in executionResult &&
    executionResult.signature
  ) {
    hash = executionResult.signature;
  }

  if (!hash) {
    return "N/A";
  }

  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  const explorerUrl = chainId ? getSolscanUrl(hash, chainId) : null;

  if (!explorerUrl) {
    return (
      <CopyTextButton
        className="font-mono text-muted-foreground text-sm"
        copyIconPosition="left"
        textToCopy={hash}
        textToShow={shortHash}
        tooltip="Copy transaction signature"
        variant="ghost"
      />
    );
  }

  return (
    <Button
      asChild
      className="-translate-x-2 gap-2 font-mono"
      size="sm"
      variant="ghost"
    >
      <Link
        href={explorerUrl}
        onClick={(e) => {
          e.stopPropagation();
        }}
        rel="noopener noreferrer"
        target="_blank"
      >
        {shortHash}{" "}
        <ExternalLinkIcon className="size-4 text-muted-foreground" />
      </Link>
    </Button>
  );
}

// EVM Queued At cell component
function EVMQueuedAtCell(props: { transaction: Transaction }) {
  const value = props.transaction.createdAt;
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return (
    <ToolTipLabel label={format(date, "PP pp z")}>
      <p>{formatDistanceToNowStrict(date, { addSuffix: true })}</p>
    </ToolTipLabel>
  );
}

// Solana Queued At cell component
function SolanaQueuedAtCell(props: { transaction: SolanaTransaction }) {
  const value = props.transaction.createdAt;
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return (
    <ToolTipLabel label={format(date, "PP pp z")}>
      <p>{formatDistanceToNowStrict(date, { addSuffix: true })}</p>
    </ToolTipLabel>
  );
}

async function getEVMTransactions({
  project,
  page,
  status,
  id,
  from,
}: {
  project: Project;
  page: number;
  status: TransactionStatus | undefined;
  id: string | undefined;
  from: string | undefined;
}): Promise<TransactionsResponse> {
  const transactions = await engineCloudProxy<{ result: TransactionsResponse }>(
    {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": project.publishableKey,
        "x-team-id": project.teamId,
      },
      method: "GET",
      pathname: `/v1/transactions`,
      searchParams: {
        limit: "20",
        page: page.toString(),
        status: status ?? undefined,
        id: id ?? undefined,
        from: from ?? undefined,
      },
    },
  );

  if (!transactions.ok) {
    return {
      transactions: [],
      pagination: {
        totalCount: 0,
        page: 1,
        limit: 20,
      },
    };
  }

  return transactions.data.result;
}

async function getSolanaTransactions({
  project,
  page,
  status,
  id,
  from,
}: {
  project: Project;
  page: number;
  status: SolanaTransactionStatus | undefined;
  id: string | undefined;
  from: string | undefined;
}): Promise<SolanaTransactionsResponse> {
  const transactions = await engineCloudProxy<{
    result: SolanaTransactionsResponse;
  }>({
    headers: {
      "Content-Type": "application/json",
      "x-client-id": project.publishableKey,
      "x-team-id": project.teamId,
      "x-chain-id": "solana:devnet", // TODO: Support multiple Solana networks
    },
    method: "GET",
    pathname: `/v1/solana/transactions`,
    searchParams: {
      limit: "20",
      page: page.toString(),
      status: status ?? undefined,
      id: id ?? undefined,
      from: from ?? undefined,
    },
  });

  if (!transactions.ok) {
    return {
      transactions: [],
      pagination: {
        totalCount: 0,
        page: 1,
        limit: 20,
      },
    };
  }

  return transactions.data.result;
}
