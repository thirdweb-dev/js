import { Input } from "@workspace/ui/components/input";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { type ThirdwebClient, toTokens } from "thirdweb";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import type { ChartConfig } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { type Transaction, useEngineTransactions } from "@/hooks/useEngine";
import { ChainIconClient } from "@/icons/ChainIcon";
import { normalizeTime } from "@/lib/time";
import { TransactionTimeline } from "./transaction-timeline";

export type EngineStatus =
  | "errored"
  | "mined"
  | "cancelled"
  | "sent"
  | "retried"
  | "processed"
  | "queued"
  | "user-op-sent";

const statusDetails: Record<
  EngineStatus,
  {
    name: string;
    type: "success" | "destructive" | "warning";
  }
> = {
  cancelled: {
    name: "Cancelled",
    type: "destructive",
  },
  errored: {
    name: "Failed",
    type: "destructive",
  },
  mined: {
    name: "Mined",
    type: "success",
  },
  processed: {
    name: "Processed",
    type: "warning",
  },
  queued: {
    name: "Queued",
    type: "warning",
  },
  retried: {
    name: "Retried",
    type: "success",
  },
  sent: {
    name: "Sent",
    type: "warning",
  },
  "user-op-sent": {
    name: "User Op Sent",
    type: "warning",
  },
};

// TODO - add Status selector dropdown here
export function TransactionsTable(props: {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EngineStatus | undefined>(undefined);
  const [filterId, setFilterId] = useState<string | undefined>(undefined);
  const autoUpdateId = useId();
  const pageSize = 10;
  const transactionsQuery = useEngineTransactions({
    authToken: props.authToken,
    autoUpdate,
    instanceUrl: props.instanceUrl,
    queryParams: {
      limit: pageSize,
      page: page,
      status,
    },
    id: filterId,
  });

  const transactions = transactionsQuery.data?.transactions ?? [];

  const idx = selectedTransaction
    ? transactions.indexOf(selectedTransaction)
    : 0;

  const totalCount = transactionsQuery.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalCount > pageSize;

  const showSkeleton =
    (transactionsQuery.isPlaceholderData && transactionsQuery.isFetching) ||
    (transactionsQuery.isLoading && !transactionsQuery.isPlaceholderData);

  const [showTxDetailsSheet, setShowTxDetailsSheet] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-4 rounded-lg rounded-b-none px-6 py-6 lg:flex-row lg:justify-between">
        <div>
          <h2 className="font-semibold text-xl tracking-tight">
            Transaction History
          </h2>
          <p className="text-muted-foreground text-sm">
            Transactions sent from your backend wallets
          </p>
        </div>

        <div className="flex items-center justify-end gap-5 border-border border-t pt-4 lg:border-none lg:pt-0">
          <div className="flex shrink-0 items-center gap-2">
            <Label htmlFor={autoUpdateId}>Auto Update</Label>
            <Switch
              checked={autoUpdate}
              id={autoUpdateId}
              onCheckedChange={(v) => setAutoUpdate(!!v)}
            />
          </div>
          <Input
            className="max-w-[250px]"
            onChange={(e) => {
              const value = e.target.value.trim();
              setFilterId(value || undefined);
              setPage(1);
            }}
            placeholder="Filter by Queue ID"
            value={filterId || ""}
          />
          <StatusSelector
            setStatus={(v) => {
              setStatus(v);
              // reset page
              setPage(1);
            }}
            status={status}
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
            {showSkeleton
              ? new Array(pageSize).fill(0).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
                  <SkeletonRow key={i} />
                ))
              : transactions.map((tx) => (
                  <TableRow
                    className="cursor-pointer hover:bg-accent/50"
                    key={`${tx.queueId}${tx.chainId}${tx.blockNumber}`}
                    onClick={() => {
                      setSelectedTransaction(tx);
                      setShowTxDetailsSheet(true);
                    }}
                  >
                    {/* Queue ID */}
                    <TableCell className="font-medium">
                      <CopyTextButton
                        className="-translate-x-1.5 -translate-y-0.5 font-mono"
                        copyIconPosition="right"
                        textToCopy={tx.queueId ?? ""}
                        textToShow={
                          tx.queueId
                            ? `${tx.queueId.slice(0, 6)}...${tx.queueId.slice(-4)}`
                            : "N/A"
                        }
                        tooltip="Copy Queue ID"
                        variant="ghost"
                      />
                    </TableCell>

                    {/* Chain Id */}
                    <TableCell>
                      <TxChainCell
                        chainId={tx.chainId || undefined}
                        client={props.client}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <TxStatusCell transaction={tx} />
                    </TableCell>

                    {/* From Address */}
                    <TableCell>
                      {tx.fromAddress ? (
                        <WalletAddress
                          address={tx.fromAddress}
                          client={props.client}
                        />
                      ) : (
                        "N/A"
                      )}
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

      {selectedTransaction && (
        <TransactionDetailsDrawer
          authToken={props.authToken}
          client={props.client}
          instanceUrl={props.instanceUrl}
          onClickNext={
            idx < transactions.length - 1
              ? () => setSelectedTransaction(transactions[idx + 1] || null)
              : undefined
          }
          onClickPrevious={
            idx > 0
              ? () => setSelectedTransaction(transactions[idx - 1] || null)
              : undefined
          }
          open={showTxDetailsSheet}
          setOpen={setShowTxDetailsSheet}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}

function StatusSelector(props: {
  status: EngineStatus | undefined;
  setStatus: (value: EngineStatus | undefined) => void;
}) {
  const statuses = Object.keys(statusDetails) as EngineStatus[];

  return (
    <Select
      onValueChange={(v) => {
        if (v === "all") {
          props.setStatus(undefined);
        } else {
          props.setStatus(v as EngineStatus);
        }
      }}
      value={props.status || "all"}
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

function TxChainCell(props: {
  chainId: string | undefined;
  client: ThirdwebClient;
}) {
  const { chainId, client } = props;
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
        client={client}
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
  const { errorMessage, minedAt } = transaction;
  const status = (transaction.status as EngineStatus) ?? null;
  if (!status) {
    return null;
  }

  const tooltip =
    status === "errored"
      ? errorMessage
      : (status === "mined" || status === "retried") && minedAt
        ? `Completed ${format(new Date(minedAt), "PP pp")}`
        : undefined;

  return (
    <ToolTipLabel hoverable label={tooltip}>
      <Badge className="gap-2" variant={statusDetails[status].type}>
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
        className="font-mono text-muted-foreground text-sm -translate-x-3"
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
      className="-translate-x-3 gap-2 font-mono"
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
        <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
      </Link>
    </Button>
  );
}

function TxQueuedAtCell(props: { transaction: Transaction }) {
  const value = props.transaction.queuedAt;
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

export function TransactionCharts(props: {
  authToken: string;
  instanceUrl: string;
}) {
  const transactionsQuery = useEngineTransactions({
    authToken: props.authToken,
    autoUpdate: false,
    instanceUrl: props.instanceUrl,
    queryParams: {
      limit: 2000,
      page: 1,
    },
  });

  const transactions = transactionsQuery.data?.transactions ?? [];

  const { analyticsData, chartConfig } = useMemo(() => {
    if (!transactions.length) {
      return {
        analyticsData: [],
        chartConfig: {},
      };
    }
    const dayToTxCountMap: Map<number, Record<string, number>> = new Map();
    const uniqueStatuses = new Set<string>();

    for (const tx of transactions) {
      if (!tx.queuedAt || !tx.status) {
        continue;
      }
      const time = normalizeTime(new Date(tx.queuedAt)).getTime();
      const entry = dayToTxCountMap.get(time) ?? {};
      entry[tx.status] = (entry[tx.status] ?? 0) + 1;
      uniqueStatuses.add(tx.status);
      dayToTxCountMap.set(time, entry);
    }

    const analyticsData = Array.from(dayToTxCountMap.entries())
      .map(([day, record]) => ({
        time: new Date(day).getTime(),
        ...record,
      }))
      .sort((a, b) => a.time - b.time);

    const chartConfig: ChartConfig = {};
    Array.from(uniqueStatuses).forEach((status, i) => {
      chartConfig[status] = {
        color:
          status === "errored"
            ? "hsl(var(--destructive-text))"
            : status === "mined"
              ? "hsl(var(--success-text))"
              : `hsl(var(--chart-${(i % 15) + 3}))`, // first letter uppercase
        label: status.charAt(0).toUpperCase() + status.slice(1),
      };
    });

    return {
      analyticsData,
      chartConfig,
    };
  }, [transactions]);

  return (
    <ThirdwebBarChart
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      config={chartConfig}
      data={analyticsData}
      header={{
        description: "Transactions sent from your backend wallets per day",
        title: "Transactions Breakdown",
        titleClassName: "text-xl mb-0",
      }}
      hideLabel={false}
      isPending={transactionsQuery.isPending}
      showLegend
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as number;
          return format(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
      variant="stacked"
    />
  );
}

const TransactionDetailsDrawer = ({
  transaction,
  instanceUrl,
  onClickPrevious,
  onClickNext,
  authToken,
  client,
  open,
  setOpen,
}: {
  transaction: Transaction;
  instanceUrl: string;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
  authToken: string;
  client: ThirdwebClient;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { idToChain } = useAllChainsData();
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);
  if (!transaction.chainId || !transaction.status) {
    return null;
  }

  const chain = idToChain.get(Number.parseInt(transaction.chainId));
  const decimals = chain?.nativeCurrency.decimals || 18;
  const symbol = chain?.nativeCurrency.symbol || "ETH";
  const explorer = chain?.explorers?.[0];

  const status = statusDetails[transaction.status as EngineStatus];
  const functionCalled =
    transaction.extension && transaction.extension !== "none"
      ? `${transaction.extension} ${transaction.functionName}`
      : (transaction.functionName ?? null);

  let txFeeDisplay = "N/A";
  if (transaction.gasLimit) {
    const gasPrice =
      transaction.effectiveGasPrice ||
      transaction.gasPrice ||
      transaction.maxFeePerGas;
    if (gasPrice) {
      const txFeeWei = BigInt(transaction.gasLimit) * BigInt(gasPrice);
      txFeeDisplay = `${toTokens(txFeeWei, decimals)} ${symbol}`;
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetContent className="!w-full !max-w-xl flex flex-col gap-0 p-0">
        <SheetHeader className="px-4 lg:px-6 py-5 border-b border-dashed">
          <SheetTitle className="text-left flex gap-3 items-center text-xl font-semibold tracking-tight">
            Transaction Details{" "}
            <Badge variant={status.type}>{status.name}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 pb-4 overflow-y-auto px-4 lg:px-6 pt-4">
          {/* Queue ID */}
          {transaction.queueId && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Queue ID</h3>
              <CopyTextButton
                className="-translate-x-1.5 -translate-y-0.5 font-mono"
                copyIconPosition="right"
                textToCopy={transaction.queueId}
                textToShow={transaction.queueId}
                tooltip="Copy Queue ID"
                variant="ghost"
              />
            </div>
          )}

          {/* Chain */}
          {chain && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Chain</h3>
              <div className="flex items-center gap-1.5">
                <ChainIconClient
                  className="size-3.5"
                  client={client}
                  src={chain?.icon?.url}
                />
                <span className="text-sm">{chain.name}</span>
              </div>
            </div>
          )}

          {/* Function */}
          {functionCalled && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Function</h3>
              <p className="font-mono px-2 py-1 bg-muted text-xs rounded-lg border inline-block">
                {functionCalled}
              </p>
            </div>
          )}

          {/* From Address */}
          {transaction.fromAddress && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">
                {transaction.accountAddress ? "Signer Address" : "From Address"}
              </h3>
              <Button
                asChild
                className="gap-2 font-mono h-auto px-2 py-0.5 -translate-x-2 -translate-y-0.5"
                size="sm"
                variant="ghost"
              >
                <Link
                  href={
                    explorer
                      ? `${explorer.url}/address/${transaction.fromAddress}`
                      : "#"
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>
                    {transaction.fromAddress?.slice(0, 6)}...
                    {transaction.fromAddress?.slice(-4)}
                  </span>
                  <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>
            </div>
          )}

          {/* Account Address */}
          {transaction.accountAddress && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Account Address</h3>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="gap-2 font-mono h-auto px-2 py-0.5 -translate-x-2 -translate-y-0.5"
              >
                <Link
                  href={
                    explorer
                      ? `${explorer.url}/address/${transaction.accountAddress}`
                      : "#"
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>
                    {transaction.accountAddress.slice(0, 6)}...
                    {transaction.accountAddress.slice(-4)}
                  </span>
                  <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>
            </div>
          )}

          {/* To Address */}
          {transaction.toAddress && (
            <div className="space-y-1">
              {/* The "to" address is usually a contract except for native token transfers. */}
              <h3 className="text-sm font-medium">
                {functionCalled === "transfer"
                  ? "Recipient Address"
                  : "Contract Address"}
              </h3>
              <Button
                asChild
                className="gap-2 font-mono h-auto px-2 py-0.5 -translate-x-2 -translate-y-0.5"
                size="sm"
                variant="ghost"
              >
                <Link
                  href={
                    explorer
                      ? `${explorer.url}/address/${transaction.toAddress}`
                      : "#"
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>
                    {transaction.toAddress?.slice(0, 6)}...
                    {transaction.toAddress?.slice(-4)}
                  </span>
                  <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>
            </div>
          )}

          {/* Error */}
          {transaction.errorMessage && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Error</h3>
              <p className="text-sm text-destructive-text">
                {errorMessageOpen
                  ? transaction.errorMessage
                  : transaction.errorMessage.length > 150
                    ? `${transaction.errorMessage.slice(0, 150)}...`
                    : transaction.errorMessage}
              </p>
              {transaction.errorMessage.length > 150 && (
                <Button
                  onClick={() => setErrorMessageOpen(!errorMessageOpen)}
                  variant="link"
                  className="h-auto p-0 text-sm text-destructive-text underline decoration-dotted decoration-destructive-text/50"
                >
                  {errorMessageOpen ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
          )}

          <div className="py-5 border-y border-dashed">
            <TransactionTimeline
              authToken={authToken}
              client={client}
              instanceUrl={instanceUrl}
              transaction={transaction}
            />
          </div>

          <div className="space-y-1">
            <div className="flex flex-row items-center gap-2">
              <h3 className="text-sm font-medium">Value</h3>
              <ToolTipLabel
                label={`The amount of ${symbol} sent to the "To" .`}
              >
                <InfoIcon className="size-4 text-muted-foreground" />
              </ToolTipLabel>
            </div>
            <p className="text-sm">
              {transaction.value
                ? toTokens(BigInt(transaction.value), decimals)
                : 0}{" "}
              {symbol}
            </p>
          </div>

          {transaction.transactionHash && (
            <>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Transaction Hash</h3>
                <Button
                  asChild
                  className="h-auto p-0 font-mono text-sm max-w-full gap-2"
                  size="sm"
                  variant="ghost"
                >
                  <Link
                    href={
                      explorer
                        ? `${explorer.url}/tx/${transaction.transactionHash}`
                        : "#"
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {transaction.transactionHash.slice(0, 6)}...
                    {transaction.transactionHash.slice(-4)}
                    <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium">Transaction Fee</h3>
                <p className="text-sm">{txFeeDisplay}</p>
              </div>

              <div className="flex flex-col gap-4">
                {typeof transaction.nonce === "number" && (
                  <div className="space-y-1">
                    <div className="flex flex-row items-center gap-2">
                      <h3 className="text-sm font-medium">Nonce</h3>
                      <ToolTipLabel label="The nonce value this transaction was submitted to mempool.">
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </ToolTipLabel>
                    </div>
                    <p className="text-sm">{transaction.nonce ?? "N/A"}</p>
                  </div>
                )}

                {transaction.gasLimit && (
                  <div className="space-y-1">
                    <div className="flex flex-row items-center gap-2">
                      <h3 className="text-sm font-medium">Gas Units</h3>
                      <ToolTipLabel label="The gas units spent for this transaction.">
                        <InfoIcon className="size-4 text-muted-foreground" />
                      </ToolTipLabel>
                    </div>
                    <p className="text-sm">
                      {Number(transaction.gasLimit).toLocaleString()}
                    </p>
                  </div>
                )}

                {transaction.gasPrice && (
                  <div className="space-y-1">
                    <div className="flex flex-row items-center gap-2">
                      <h3 className="text-sm font-medium">Gas Price</h3>
                      <ToolTipLabel label="The price in wei spent for each gas unit.">
                        <InfoIcon className="size-4 text-muted-foreground " />
                      </ToolTipLabel>
                    </div>
                    <p className="text-sm">
                      {Number(transaction.gasPrice).toLocaleString()}
                    </p>
                  </div>
                )}

                {transaction.blockNumber && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Block</h3>
                    <Button
                      asChild
                      className="h-auto p-0 text-sm max-w-full"
                      size="sm"
                      variant="ghost"
                    >
                      <Link
                        href={
                          explorer
                            ? `${explorer.url}/block/${transaction.blockNumber}`
                            : "#"
                        }
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {transaction.blockNumber}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* footer */}
        <div className="pt-6 flex flex-row justify-end gap-3 mt-auto border-t border-dashed px-4 lg:px-6 py-5">
          <Button
            className="gap-2 bg-card"
            size="sm"
            disabled={!onClickPrevious}
            onClick={onClickPrevious}
            variant="outline"
          >
            <ArrowLeftIcon className="size-4" />
            Previous
          </Button>
          <Button
            className="gap-2 bg-card"
            size="sm"
            disabled={!onClickNext}
            onClick={onClickNext}
            variant="outline"
          >
            Next
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
