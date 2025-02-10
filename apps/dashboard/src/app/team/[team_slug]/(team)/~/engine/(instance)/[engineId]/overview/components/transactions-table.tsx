import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { PaginationButtons } from "@/components/pagination-buttons";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  type Transaction,
  useEngineTransactions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Collapse, Divider, useDisclosure } from "@chakra-ui/react";
import { ChainIcon } from "components/icons/ChainIcon";
import { formatDistanceToNowStrict } from "date-fns";
import { format, formatDate } from "date-fns/format";
import { useAllChainsData } from "hooks/chains/allChains";
import {
  ExternalLinkIcon,
  InfoIcon,
  MoveLeftIcon,
  MoveRightIcon,
} from "lucide-react";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toTokens } from "thirdweb";
import { FormLabel, LinkButton, Text } from "tw-components";
import { normalizeTime } from "../../../../../../../../../../lib/time";
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
  mined: {
    name: "Mined",
    type: "success",
  },
  errored: {
    name: "Failed",
    type: "destructive",
  },
  cancelled: {
    name: "Cancelled",
    type: "destructive",
  },
  queued: {
    name: "Queued",
    type: "warning",
  },
  processed: {
    name: "Processed",
    type: "warning",
  },
  sent: {
    name: "Sent",
    type: "warning",
  },
  "user-op-sent": {
    name: "User Op Sent",
    type: "warning",
  },
  retried: {
    name: "Retried",
    type: "success",
  },
};

// TODO - add Status selector dropdown here
export function TransactionsTable(props: {
  instanceUrl: string;
  authToken: string;
}) {
  const transactionDisclosure = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EngineStatus | undefined>(undefined);

  const pageSize = 10;
  const transactionsQuery = useEngineTransactions({
    instanceUrl: props.instanceUrl,
    autoUpdate,
    authToken: props.authToken,
    queryParams: {
      limit: pageSize,
      page: page,
      status,
    },
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
                    onClick={() => {
                      setSelectedTransaction(tx);
                      transactionDisclosure.onOpen();
                    }}
                    key={`${tx.queueId}${tx.chainId}${tx.blockNumber}`}
                    className="cursor-pointer hover:bg-accent/50"
                  >
                    {/* Queue ID */}
                    <TableCell className="font-medium">
                      <CopyAddressButton
                        address={tx.queueId ? tx.queueId : ""}
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
                      {tx.fromAddress ? (
                        <WalletAddress address={tx.fromAddress} />
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

      {transactionDisclosure.isOpen && selectedTransaction && (
        <TransactionDetailsDrawer
          transaction={selectedTransaction}
          instanceUrl={props.instanceUrl}
          authToken={props.authToken}
          onClickPrevious={
            idx > 0
              ? () => setSelectedTransaction(transactions[idx - 1] || null)
              : undefined
          }
          onClickNext={
            idx < transactions.length - 1
              ? () => setSelectedTransaction(transactions[idx + 1] || null)
              : undefined
          }
          setSelectedTransaction={setSelectedTransaction}
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
      value={props.status || "all"}
      onValueChange={(v) => {
        if (v === "all") {
          props.setStatus(undefined);
        } else {
          props.setStatus(v as EngineStatus);
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

  if (!chainId) {
    return "N/A";
  }

  const chain = idToChain.get(Number.parseInt(chainId));

  if (!chain) {
    return `Chain ID: ${chainId}`;
  }

  return (
    <div className="flex items-center gap-2">
      <ChainIcon className="size-5" ipfsSrc={chain.icon?.url} />
      <div className="max-w-[150px] truncate">
        {chain.name ?? `Chain ID: ${chainId}`}
      </div>
    </div>
  );
}

function TxStatusCell(props: {
  transaction: Transaction;
}) {
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
    instanceUrl: props.instanceUrl,
    autoUpdate: false,
    authToken: props.authToken,
    queryParams: {
      limit: 10000,
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
        label: status.charAt(0).toUpperCase() + status.slice(1), // first letter uppercase
        color:
          status === "errored"
            ? "hsl(var(--destructive-text))"
            : status === "mined"
              ? "hsl(var(--success-text))"
              : `hsl(var(--chart-${(i % 15) + 3}))`,
      };
    });

    return {
      analyticsData,
      chartConfig,
    };
  }, [transactions]);

  return (
    <ThirdwebBarChart
      title="Transactions Breakdown"
      description="Transactions sent from your backend wallets per day"
      config={chartConfig}
      data={analyticsData}
      isPending={transactionsQuery.isPending}
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      titleClassName="text-xl mb-0"
      hideLabel={false}
      variant="stacked"
      showLegend
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as number;
          return formatDate(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
    />
  );
}

const TransactionDetailsDrawer = ({
  transaction,
  instanceUrl,
  onClickPrevious,
  onClickNext,
  setSelectedTransaction,
  authToken,
}: {
  transaction: Transaction;
  instanceUrl: string;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
  setSelectedTransaction: Dispatch<SetStateAction<Transaction | null>>;
  authToken: string;
}) => {
  const { idToChain } = useAllChainsData();
  const errorMessageDisclosure = useDisclosure();
  const advancedTxDetailsDisclosure = useDisclosure();

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

  const handleOpenChange = (isOpen: boolean) => {
    setSelectedTransaction(isOpen ? transaction : null);
  };

  return (
    <Sheet open={!!transaction} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:min-w-[500px] lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle className="mb-3 flex flex-row items-center gap-3 border-border border-b pb-3 text-left">
            Transaction Details <Badge variant="outline">{status.name}</Badge>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div>
            <FormLabel>Queue ID</FormLabel>
            <Text>{transaction.queueId}</Text>
          </div>

          <div>
            <FormLabel>Chain</FormLabel>
            <div className="flex items-center gap-2">
              <ChainIcon className="size-5" ipfsSrc={chain?.icon?.url} />
              <span>{chain?.name}</span>
            </div>
          </div>

          {functionCalled && (
            <div>
              <FormLabel>Function</FormLabel>
              <Text>{functionCalled}</Text>
            </div>
          )}

          <div>
            <FormLabel>
              {transaction.accountAddress ? "Signer Address" : "From Address"}
            </FormLabel>
            <LinkButton
              variant="ghost"
              isExternal
              size="xs"
              href={
                explorer
                  ? `${explorer.url}/address/${transaction.fromAddress}`
                  : "#"
              }
            >
              <Text fontFamily="mono">{transaction.fromAddress}</Text>
            </LinkButton>
          </div>

          {transaction.accountAddress && (
            <div>
              <FormLabel>Account Address</FormLabel>
              <LinkButton
                variant="ghost"
                isExternal
                size="xs"
                href={
                  explorer
                    ? `${explorer.url}/address/${transaction.accountAddress}`
                    : "#"
                }
              >
                <Text fontFamily="mono">{transaction.accountAddress}</Text>
              </LinkButton>
            </div>
          )}

          <div>
            {/* The "to" address is usually a contract except for native token transfers. */}
            <FormLabel>
              {functionCalled === "transfer"
                ? "Recipient Address"
                : "Contract Address"}
            </FormLabel>
            <LinkButton
              variant="ghost"
              isExternal
              size="xs"
              href={
                explorer
                  ? `${explorer.url}/address/${transaction.toAddress}`
                  : "#"
              }
            >
              <Text fontFamily="mono">{transaction.toAddress}</Text>
            </LinkButton>
          </div>

          {transaction.errorMessage && (
            <div>
              <FormLabel>Error</FormLabel>
              <Text noOfLines={errorMessageDisclosure.isOpen ? undefined : 3}>
                {transaction.errorMessage}
              </Text>
              <Button onClick={errorMessageDisclosure.onToggle} variant="link">
                {errorMessageDisclosure.isOpen ? "Show less" : "Show more"}
              </Button>
            </div>
          )}

          <Divider />

          <TransactionTimeline
            transaction={transaction}
            instanceUrl={instanceUrl}
            authToken={authToken}
          />

          <Divider />

          {/* On-chain details */}

          <div>
            <div className="flex flex-row">
              <FormLabel>Value</FormLabel>
              <ToolTipLabel
                label={`The amount of ${symbol} sent to the "To" .`}
              >
                <InfoIcon className="size-4" />
              </ToolTipLabel>
            </div>
            <Text>
              {transaction.value
                ? toTokens(BigInt(transaction.value), decimals)
                : 0}{" "}
              {symbol}
            </Text>
          </div>

          {transaction.transactionHash && (
            <>
              <div>
                <FormLabel>Transaction Hash</FormLabel>
                <LinkButton
                  variant="ghost"
                  isExternal
                  size="xs"
                  href={
                    explorer
                      ? `${explorer.url}/tx/${transaction.transactionHash}`
                      : "#"
                  }
                  maxW="100%"
                >
                  <Text fontFamily="mono" isTruncated>
                    {transaction.transactionHash}
                  </Text>
                </LinkButton>
              </div>

              <div>
                <FormLabel>Transaction Fee</FormLabel>
                <Text>{txFeeDisplay}</Text>
              </div>

              <Collapse in={advancedTxDetailsDisclosure.isOpen}>
                <div className="flex flex-col gap-4">
                  {transaction.nonce && (
                    <div>
                      <div className="flex flex-row">
                        <FormLabel>Nonce</FormLabel>
                        <ToolTipLabel label="The nonce value this transaction was submitted to mempool.">
                          <InfoIcon className="size-4" />
                        </ToolTipLabel>
                      </div>
                      <Text>{transaction.nonce ?? "N/A"}</Text>
                    </div>
                  )}

                  {transaction.gasLimit && (
                    <div>
                      <div className="flex flex-row">
                        <FormLabel>Gas Units</FormLabel>
                        <ToolTipLabel label="The gas units spent for this transaction.">
                          <InfoIcon className="size-4" />
                        </ToolTipLabel>
                      </div>
                      <Text>
                        {Number(transaction.gasLimit).toLocaleString()}
                      </Text>
                    </div>
                  )}

                  {transaction.gasPrice && (
                    <div>
                      <div className="flex flex-row">
                        <FormLabel>Gas Price</FormLabel>
                        <ToolTipLabel label="The price in wei spent for each gas unit.">
                          <InfoIcon className="size-4" />
                        </ToolTipLabel>
                      </div>
                      <Text>
                        {Number(transaction.gasPrice).toLocaleString()}
                      </Text>
                    </div>
                  )}

                  {transaction.blockNumber && (
                    <div>
                      <FormLabel>Block</FormLabel>
                      <LinkButton
                        variant="ghost"
                        isExternal
                        size="xs"
                        href={
                          explorer
                            ? `${explorer.url}/block/${transaction.blockNumber}`
                            : "#"
                        }
                        maxW="100%"
                      >
                        <Text>{transaction.blockNumber}</Text>
                      </LinkButton>
                    </div>
                  )}
                </div>
              </Collapse>

              <Button
                onClick={advancedTxDetailsDisclosure.onToggle}
                variant="link"
                size="sm"
                className="w-fit"
              >
                {advancedTxDetailsDisclosure.isOpen
                  ? "Hide transaction details"
                  : "Show transaction details"}
              </Button>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-row justify-end gap-3 border-border border-t pt-4">
          <Button
            disabled={!onClickPrevious}
            onClick={onClickPrevious}
            variant="outline"
            className="gap-2"
          >
            <MoveLeftIcon className="size-4" />
            Previous
          </Button>
          <Button
            disabled={!onClickNext}
            onClick={onClickNext}
            variant="outline"
            className="gap-2"
          >
            Next
            <MoveRightIcon className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
