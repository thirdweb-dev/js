import type { Transaction } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Collapse,
  Divider,
  DrawerHeader,
  Flex,
  FormControl,
  Stack,
  Tooltip,
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns/format";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import { useAllChainsData } from "hooks/chains/allChains";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiInfo } from "react-icons/fi";
import type { ChainMetadata } from "thirdweb/chains";
import {
  Badge,
  Button,
  Card,
  Drawer,
  FormLabel,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { TransactionTimeline } from "./transaction-timeline";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isFetched: boolean;
  instanceUrl: string;
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
    colorScheme: string;
    showTooltipIcon?: boolean;
  }
> = {
  processed: {
    name: "Processed",
    colorScheme: "yellow",
  },
  queued: {
    name: "Queued",
    colorScheme: "yellow",
  },
  sent: {
    name: "Sent",
    colorScheme: "yellow",
  },
  "user-op-sent": {
    name: "User Op Sent",
    colorScheme: "yellow",
  },
  mined: {
    name: "Mined",
    colorScheme: "green",
  },
  retried: {
    name: "Retried",
    colorScheme: "green",
  },
  errored: {
    name: "Failed",
    colorScheme: "red",
  },
  cancelled: {
    name: "Cancelled",
    colorScheme: "red",
  },
};

const columnHelper = createColumnHelper<Transaction>();

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  isFetched,
  instanceUrl,
}) => {
  const { chainIdToChainRecord } = useAllChainsData();
  const transactionDisclosure = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const columns = [
    columnHelper.accessor("queueId", {
      header: "Queue ID",
      cell: (cell) => {
        return (
          <AddressCopyButton
            address={cell.getValue() ?? ""}
            title="queue ID"
            size="xs"
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

        const chain = chainIdToChainRecord[Number.parseInt(chainId)];
        if (chain) {
          return (
            <Flex align="center" gap={2}>
              <ChainIcon size={12} ipfsSrc={chain?.icon?.url} />
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
              <Badge
                borderRadius="full"
                size="label.sm"
                variant="subtle"
                px={3}
                py={1.5}
                colorScheme={statusDetails[status].colorScheme}
              >
                <Flex gap={1} align="center">
                  {statusDetails[status].name}
                  {statusDetails[status].showTooltipIcon && <FiInfo />}
                </Flex>
              </Badge>
            </Tooltip>
          </Flex>
        );
      },
    }),
    columnHelper.accessor("fromAddress", {
      header: "From",
      cell: (cell) => {
        return <AddressCopyButton size="xs" address={cell.getValue() ?? ""} />;
      },
    }),
    columnHelper.accessor("transactionHash", {
      header: "Tx Hash",
      cell: (cell) => {
        const { chainId, transactionHash } = cell.row.original;
        if (!chainId || !transactionHash) {
          return;
        }

        const chain = chainIdToChainRecord[Number.parseInt(chainId)];
        if (chain) {
          const explorer = chain.explorers?.[0];
          if (!explorer) {
            return (
              <AddressCopyButton
                address={transactionHash}
                title="transaction hash"
              />
            );
          }

          return (
            <Text fontFamily="mono" maxW="100px" isTruncated>
              {transactionHash}
            </Text>
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

  return (
    <>
      <TWTable
        title="transactions"
        data={transactions}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onRowClick={(row) => {
          setSelectedTransaction(row);
          transactionDisclosure.onOpen();
        }}
      />

      {transactionDisclosure.isOpen && selectedTransaction && (
        <TransactionDetailsDrawer
          transaction={selectedTransaction}
          instanceUrl={instanceUrl}
          disclosure={transactionDisclosure}
          onClickPrevious={
            idx > 0
              ? () => setSelectedTransaction(transactions[idx - 1])
              : undefined
          }
          onClickNext={
            idx < transactions.length - 1
              ? () => setSelectedTransaction(transactions[idx + 1])
              : undefined
          }
        />
      )}
    </>
  );
};

const TransactionDetailsDrawer = ({
  transaction,
  instanceUrl,
  disclosure,
  onClickPrevious,
  onClickNext,
}: {
  transaction: Transaction;
  instanceUrl: string;
  disclosure: UseDisclosureReturn;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
}) => {
  const { chainIdToChainRecord } = useAllChainsData();
  const errorMessageDisclosure = useDisclosure();
  const advancedTxDetailsDisclosure = useDisclosure();

  if (!transaction.chainId || !transaction.status) {
    return null;
  }

  const chain: ChainMetadata | undefined =
    chainIdToChainRecord[Number.parseInt(transaction.chainId)];
  const explorer = chain?.explorers?.[0];

  const status = statusDetails[transaction.status as EngineStatus];
  const functionCalled =
    transaction.extension && transaction.extension !== "none"
      ? `${transaction.extension} ${transaction.functionName}`
      : transaction.functionName ?? null;

  let txFeeDisplay = "N/A";
  if (transaction.gasLimit && transaction.gasPrice) {
    const txFee =
      (Number.parseFloat(transaction.gasLimit) *
        Number.parseFloat(transaction.gasPrice)) /
      10 ** (chain?.nativeCurrency.decimals || 18);
    txFeeDisplay = `${txFee} ${chain?.nativeCurrency.symbol || "ETH"}`;
  }

  return (
    <Drawer
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      size="sm"
      closeOnOverlayClick
      header={{
        children: (
          <DrawerHeader as={Flex} gap={3}>
            <Heading size="title.sm">Transaction Details</Heading>
            <Badge
              borderRadius="full"
              size="label.sm"
              variant="subtle"
              px={3}
              py={1.5}
              colorScheme={status.colorScheme}
              w="fit-content"
            >
              {status.name}
            </Badge>
          </DrawerHeader>
        ),
      }}
      footer={{
        children: (
          <Flex gap={3}>
            <Button
              isDisabled={!onClickPrevious}
              onClick={onClickPrevious}
              variant="outline"
              leftIcon={<FiArrowLeft />}
            >
              Previous
            </Button>
            <Button
              isDisabled={!onClickNext}
              onClick={onClickNext}
              variant="outline"
              rightIcon={<FiArrowRight />}
            >
              Next
            </Button>
          </Flex>
        ),
      }}
    >
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Queue ID</FormLabel>
          <Text>{transaction.queueId}</Text>
        </FormControl>

        <FormControl>
          <FormLabel>Chain</FormLabel>
          <Flex align="center" gap={2}>
            <ChainIcon size={12} ipfsSrc={chain?.icon?.url} />
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
          <FormLabel>From Address</FormLabel>
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

        <FormControl>
          <FormLabel>To Address</FormLabel>
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
        />

        <Divider />

        {/* On-chain details */}

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
              <Stack spacing={4}>
                {transaction.nonce && (
                  <FormControl>
                    <Flex>
                      <FormLabel>Nonce</FormLabel>
                      <Tooltip
                        label="The nonce value this transaction was submitted to mempool."
                        shouldWrapChildren
                      >
                        <FiInfo />
                      </Tooltip>
                    </Flex>
                    <Text>{transaction.nonce ?? "N/A"}</Text>
                  </FormControl>
                )}

                {transaction.gasLimit && (
                  <FormControl>
                    <Flex>
                      <FormLabel>Gas Units</FormLabel>
                      <Tooltip
                        label="The gas units spent for this transaction."
                        shouldWrapChildren
                      >
                        <FiInfo />
                      </Tooltip>
                    </Flex>
                    <Text>{Number(transaction.gasLimit).toLocaleString()}</Text>
                  </FormControl>
                )}

                {transaction.gasPrice && (
                  <FormControl>
                    <Flex>
                      <FormLabel>Gas Price</FormLabel>
                      <Tooltip
                        label="The price in wei spent for each gas unit."
                        shouldWrapChildren
                      >
                        <FiInfo />
                      </Tooltip>
                    </Flex>
                    <Text>{Number(transaction.gasPrice).toLocaleString()}</Text>
                  </FormControl>
                )}
              </Stack>
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
      </Stack>
    </Drawer>
  );
};
