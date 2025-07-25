import { Collapse, Divider, useDisclosure } from "@chakra-ui/react";
import { LinkButton } from "chakra/button";
import { FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  ExternalLinkIcon,
  InfoIcon,
  MoveLeftIcon,
  MoveRightIcon,
} from "lucide-react";
import Link from "next/link";
import {
  type Dispatch,
  type SetStateAction,
  useId,
  useMemo,
  useState,
} from "react";
import { type ThirdwebClient, toTokens } from "thirdweb";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
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
  const transactionDisclosure = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EngineStatus | undefined>(undefined);
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
            <Label htmlFor={autoUpdateId}>Auto Update</Label>
            <Switch
              checked={autoUpdate}
              id={autoUpdateId}
              onCheckedChange={(v) => setAutoUpdate(!!v)}
            />
          </div>
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
                      transactionDisclosure.onOpen();
                    }}
                  >
                    {/* Queue ID */}
                    <TableCell className="font-medium">
                      <CopyAddressButton
                        address={tx.queueId ? tx.queueId : ""}
                        className="text-muted-foreground"
                        copyIconPosition="left"
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

      {transactionDisclosure.isOpen && selectedTransaction && (
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
          setSelectedTransaction={setSelectedTransaction}
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
  setSelectedTransaction,
  authToken,
  client,
}: {
  transaction: Transaction;
  instanceUrl: string;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
  setSelectedTransaction: Dispatch<SetStateAction<Transaction | null>>;
  authToken: string;
  client: ThirdwebClient;
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
    <Sheet onOpenChange={handleOpenChange} open={!!transaction}>
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
              <ChainIconClient
                className="size-5"
                client={client}
                src={chain?.icon?.url}
              />
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
              href={
                explorer
                  ? `${explorer.url}/address/${transaction.fromAddress}`
                  : "#"
              }
              isExternal
              size="xs"
              variant="ghost"
            >
              <Text fontFamily="mono">{transaction.fromAddress}</Text>
            </LinkButton>
          </div>

          {transaction.accountAddress && (
            <div>
              <FormLabel>Account Address</FormLabel>
              <LinkButton
                href={
                  explorer
                    ? `${explorer.url}/address/${transaction.accountAddress}`
                    : "#"
                }
                isExternal
                size="xs"
                variant="ghost"
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
              href={
                explorer
                  ? `${explorer.url}/address/${transaction.toAddress}`
                  : "#"
              }
              isExternal
              size="xs"
              variant="ghost"
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
            authToken={authToken}
            client={client}
            instanceUrl={instanceUrl}
            transaction={transaction}
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
                  href={
                    explorer
                      ? `${explorer.url}/tx/${transaction.transactionHash}`
                      : "#"
                  }
                  isExternal
                  maxW="100%"
                  size="xs"
                  variant="ghost"
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
                        href={
                          explorer
                            ? `${explorer.url}/block/${transaction.blockNumber}`
                            : "#"
                        }
                        isExternal
                        maxW="100%"
                        size="xs"
                        variant="ghost"
                      >
                        <Text>{transaction.blockNumber}</Text>
                      </LinkButton>
                    </div>
                  )}
                </div>
              </Collapse>

              <Button
                className="w-fit"
                onClick={advancedTxDetailsDisclosure.onToggle}
                size="sm"
                variant="link"
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
            className="gap-2"
            disabled={!onClickPrevious}
            onClick={onClickPrevious}
            variant="outline"
          >
            <MoveLeftIcon className="size-4" />
            Previous
          </Button>
          <Button
            className="gap-2"
            disabled={!onClickNext}
            onClick={onClickNext}
            variant="outline"
          >
            Next
            <MoveRightIcon className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
