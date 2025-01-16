import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Badge } from "@/components/ui/badge";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Transaction } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Collapse,
  Divider,
  Flex,
  FormControl,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ChainIcon } from "components/icons/ChainIcon";
import { formatDistanceToNowStrict } from "date-fns";
import { format, formatDate } from "date-fns/format";
import { useAllChainsData } from "hooks/chains/allChains";
import { InfoIcon, MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toTokens } from "thirdweb";
import { Button, Card, FormLabel, LinkButton, Text } from "tw-components";
import { TWTable } from "../../../../../../../../../../components/shared/TWTable";
import { TransactionTimeline } from "./transaction-timeline";

interface TransactionsTableProps {
  transactions: Transaction[];
  isPending: boolean;
  isFetched: boolean;
  instanceUrl: string;
  authToken: string;
}

type EngineStatus =
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
    showTooltipIcon?: boolean;
  }
> = {
  processed: {
    name: "Processed",
    type: "warning",
  },
  queued: {
    name: "Queued",
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
  mined: {
    name: "Mined",
    type: "success",
  },
  retried: {
    name: "Retried",
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
};

const columnHelper = createColumnHelper<Transaction>();

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isPending,
  isFetched,
  instanceUrl,
  authToken,
}) => {
  const { idToChain } = useAllChainsData();
  const transactionDisclosure = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const columns = [
    columnHelper.accessor("queueId", {
      header: "Queue ID",
      cell: (cell) => {
        return (
          <CopyAddressButton
            address={cell.getValue() ?? ""}
            copyIconPosition="left"
            variant="ghost"
            className="text-muted-foreground"
          />
        );
      },
    }),
    columnHelper.accessor("chainId", {
      header: "Chain",
      cell: (cell) => {
        const chainId = cell.getValue();
        if (!chainId) {
          return;
        }

        const chain = idToChain.get(Number.parseInt(chainId));
        if (chain) {
          return (
            <Flex align="center" gap={2} className="py-2">
              <ChainIcon className="size-3" ipfsSrc={chain?.icon?.url} />
              <Text maxW={150} isTruncated>
                {chain?.name ?? "N/A"}
              </Text>
            </Flex>
          );
        }
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (cell) => {
        const transaction = cell.row.original;
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
          <Flex align="center" gap={1}>
            <Tooltip
              borderRadius="md"
              bg="transparent"
              boxShadow="none"
              maxW={{ md: "450px" }}
              label={
                tooltip ? (
                  <Card bgColor="backgroundHighlight">
                    <Text>{tooltip}</Text>
                  </Card>
                ) : undefined
              }
            >
              <div>
                <Badge variant={statusDetails[status].type}>
                  <Flex gap={1} align="center">
                    {statusDetails[status].name}
                    {statusDetails[status].showTooltipIcon && (
                      <InfoIcon className="size-4" />
                    )}
                  </Flex>
                </Badge>
              </div>
            </Tooltip>
          </Flex>
        );
      },
    }),
    columnHelper.accessor("fromAddress", {
      header: "From",
      cell: (cell) => {
        return <WalletAddress address={cell.getValue() ?? ""} />;
      },
    }),
    columnHelper.accessor("transactionHash", {
      header: "Tx Hash",
      cell: (cell) => {
        const { chainId, transactionHash } = cell.row.original;
        if (!chainId || !transactionHash) {
          return;
        }

        const chain = idToChain.get(Number.parseInt(chainId));
        if (chain) {
          const explorer = chain.explorers?.[0];
          if (!explorer) {
            return (
              <CopyAddressButton
                address={transactionHash}
                copyIconPosition="left"
                variant="ghost"
              />
            );
          }

          return (
            <CopyTextButton
              textToCopy={transactionHash}
              copyIconPosition="left"
              textToShow={`${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`}
              variant="ghost"
              tooltip="Copy transaction hash"
              className="font-mono text-muted-foreground text-sm"
            />
          );
        }
      },
    }),
    columnHelper.accessor("queuedAt", {
      header: "Queued",
      cell: (cell) => {
        const value = cell.getValue();
        if (!value) {
          return;
        }

        const date = new Date(value);
        return (
          <Tooltip
            borderRadius="md"
            bg="transparent"
            boxShadow="none"
            label={
              <Card bgColor="backgroundHighlight">
                <Text>{format(date, "PP pp z")}</Text>
              </Card>
            }
            shouldWrapChildren
          >
            <Text>{formatDistanceToNowStrict(date, { addSuffix: true })}</Text>
          </Tooltip>
        );
      },
    }),
  ];

  const idx = selectedTransaction
    ? transactions.indexOf(selectedTransaction)
    : 0;

  const { analyticsData, chartConfig } = useMemo(() => {
    const dayToTxCountMap: Map<number, Record<string, number>> = new Map();
    const uniqueStatuses = new Set<string>();

    for (const tx of transactions) {
      if (!tx.queuedAt || !tx.status) {
        continue;
      }
      const normalizedDate = new Date(tx.queuedAt);
      normalizedDate.setHours(0, 0, 0, 0); // normalize time
      const time = normalizedDate.getTime();
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
    <>
      <ThirdwebBarChart
        title="Daily Transactions"
        description="Transactions sent from your backend wallets per day"
        config={chartConfig}
        data={analyticsData}
        isPending={isPending}
        chartClassName="aspect-[1.5] lg:aspect-[4.5]"
        titleClassName="text-xl mb-0"
        hideLabel={false}
        toolTipLabelFormatter={(_v, item) => {
          if (Array.isArray(item)) {
            const time = item[0].payload.time as number;
            return formatDate(new Date(time), "MMM d, yyyy");
          }
          return undefined;
        }}
      />

      <div className="h-8" />

      <TWTable
        title="transactions"
        data={transactions}
        columns={columns}
        isPending={isPending}
        isFetched={isFetched}
        bodyRowClassName="hover:bg-accent/50"
        tableScrollableClassName="max-h-[1000px]"
        onRowClick={(row) => {
          setSelectedTransaction(row);
          transactionDisclosure.onOpen();
        }}
      />

      {transactionDisclosure.isOpen && selectedTransaction && (
        <TransactionDetailsDrawer
          transaction={selectedTransaction}
          instanceUrl={instanceUrl}
          authToken={authToken}
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
    </>
  );
};

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
          <FormControl>
            <FormLabel>Queue ID</FormLabel>
            <Text>{transaction.queueId}</Text>
          </FormControl>

          <FormControl>
            <FormLabel>Chain</FormLabel>
            <Flex align="center" gap={2}>
              <ChainIcon className="size-3" ipfsSrc={chain?.icon?.url} />
              <Text>{chain?.name}</Text>
            </Flex>
          </FormControl>

          {functionCalled && (
            <FormControl>
              <FormLabel>Function</FormLabel>
              <Text>{functionCalled}</Text>
            </FormControl>
          )}

          <FormControl>
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
          </FormControl>

          {transaction.accountAddress && (
            <FormControl>
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
            </FormControl>
          )}

          <FormControl>
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
          </FormControl>

          {transaction.errorMessage && (
            <FormControl>
              <FormLabel>Error</FormLabel>
              <Text noOfLines={errorMessageDisclosure.isOpen ? undefined : 3}>
                {transaction.errorMessage}
              </Text>
              <Button
                onClick={errorMessageDisclosure.onToggle}
                variant="link"
                size="xs"
                colorScheme="gray"
              >
                {errorMessageDisclosure.isOpen ? "Show less" : "Show more"}
              </Button>
            </FormControl>
          )}

          <Divider />

          <TransactionTimeline
            transaction={transaction}
            instanceUrl={instanceUrl}
            authToken={authToken}
          />

          <Divider />

          {/* On-chain details */}

          <FormControl>
            <div className="flex flex-row">
              <FormLabel>Value</FormLabel>
              <Tooltip
                label={`The amount of ${symbol} sent to the "To" .`}
                shouldWrapChildren
              >
                <InfoIcon className="size-4" />
              </Tooltip>
            </div>
            <Text>
              {transaction.value
                ? toTokens(BigInt(transaction.value), decimals)
                : 0}{" "}
              {symbol}
            </Text>
          </FormControl>

          {transaction.transactionHash && (
            <>
              <FormControl>
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
              </FormControl>

              <FormControl>
                <FormLabel>Transaction Fee</FormLabel>
                <Text>{txFeeDisplay}</Text>
              </FormControl>

              <Collapse in={advancedTxDetailsDisclosure.isOpen}>
                <div className="flex flex-col gap-4">
                  {transaction.nonce && (
                    <FormControl>
                      <div className="flex flex-row">
                        <FormLabel>Nonce</FormLabel>
                        <Tooltip
                          label="The nonce value this transaction was submitted to mempool."
                          shouldWrapChildren
                        >
                          <InfoIcon className="size-4" />
                        </Tooltip>
                      </div>
                      <Text>{transaction.nonce ?? "N/A"}</Text>
                    </FormControl>
                  )}

                  {transaction.gasLimit && (
                    <FormControl>
                      <div className="flex flex-row">
                        <FormLabel>Gas Units</FormLabel>
                        <Tooltip
                          label="The gas units spent for this transaction."
                          shouldWrapChildren
                        >
                          <InfoIcon className="size-4" />
                        </Tooltip>
                      </div>
                      <Text>
                        {Number(transaction.gasLimit).toLocaleString()}
                      </Text>
                    </FormControl>
                  )}

                  {transaction.gasPrice && (
                    <FormControl>
                      <div className="flex flex-row">
                        <FormLabel>Gas Price</FormLabel>
                        <Tooltip
                          label="The price in wei spent for each gas unit."
                          shouldWrapChildren
                        >
                          <InfoIcon className="size-4" />
                        </Tooltip>
                      </div>
                      <Text>
                        {Number(transaction.gasPrice).toLocaleString()}
                      </Text>
                    </FormControl>
                  )}

                  {transaction.blockNumber && (
                    <FormControl>
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
                    </FormControl>
                  )}
                </div>
              </Collapse>

              <Button
                onClick={advancedTxDetailsDisclosure.onToggle}
                variant="link"
                size="xs"
                colorScheme="gray"
                w="fit-content"
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
            isDisabled={!onClickPrevious}
            onClick={onClickPrevious}
            variant="outline"
            leftIcon={<MoveLeftIcon className="size-4" />}
          >
            Previous
          </Button>
          <Button
            isDisabled={!onClickNext}
            onClick={onClickNext}
            variant="outline"
            rightIcon={<MoveRightIcon className="size-4" />}
          >
            Next
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
