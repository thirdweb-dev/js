import { useApiAuthToken } from "@3rdweb-sdk/react/hooks/useApi";
import { Transaction } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { Chain } from "@thirdweb-dev/chains";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRef } from "react";
import { FiInfo, FiTrash } from "react-icons/fi";
import {
  Card,
  Button,
  FormLabel,
  LinkButton,
  Text,
  Badge,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { fetchChain } from "utils/fetchChain";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isFetched: boolean;
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
    showTooltipIcon: true,
  },
  retried: {
    name: "Retried",
    colorScheme: "green",
    showTooltipIcon: true,
  },
  errored: {
    name: "Failed",
    colorScheme: "red",
    showTooltipIcon: true,
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
}) => {
  const queryClient = useQueryClient();

  const columns = [
    columnHelper.accessor("chainId", {
      header: "Chain",
      cell: (cell) => {
        const chainId = cell.getValue();
        if (!chainId) {
          return;
        }

        const chain = queryClient.getQueryData<Chain>([
          "chainDetails",
          chainId,
        ]);
        if (chain) {
          return (
            <Flex align="center" gap={2}>
              <ChainIcon size={12} ipfsSrc={chain?.icon?.url} />
              <Text>{chain.name}</Text>
            </Flex>
          );
        }

        queryClient.prefetchQuery(["chainDetails", chainId], () =>
          fetchChain(chainId),
        );
      },
    }),
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
    columnHelper.accessor("status", {
      header: "Status",
      cell: (cell) => {
        const transaction = cell.row.original;
        const { errorMessage, minedAt } = transaction;
        const status = (transaction.status as EngineStatus) ?? null;
        if (!status) {
          return null;
        }

        const showCancelTransactionButton = [
          "processed",
          "queued",
          "sent",
        ].includes(status);

        const shouldShowTooltip =
          status === "errored" || (status === "mined" && minedAt);

        return (
          <Flex align="center" gap={1}>
            <Tooltip
              borderRadius="md"
              bg="transparent"
              boxShadow="none"
              maxW={{ md: "450px" }}
              label={
                shouldShowTooltip ? (
                  <Card bgColor="backgroundHighlight">
                    <Text>
                      {status === "errored"
                        ? errorMessage
                        : (status === "mined" || status === "retried") &&
                          minedAt
                        ? `Completed ${format(new Date(minedAt), "PP pp")}`
                        : undefined}
                    </Text>
                  </Card>
                ) : null
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
            {showCancelTransactionButton && (
              <CancelTransactionButton transaction={transaction} />
            )}
          </Flex>
        );
      },
    }),
    columnHelper.accessor("fromAddress", {
      header: "Backend Wallet",
      cell: (cell) => {
        return <AddressCopyButton size="xs" address={cell.getValue() ?? ""} />;
      },
    }),
    columnHelper.accessor("functionName", {
      header: "Function",
      cell: (cell) => {
        const { functionName, extension } = cell.row.original;
        const functionDisplay =
          extension === "none" ? functionName : `${extension} ${functionName}`;

        return (
          <Tooltip
            borderRadius="md"
            bg="transparent"
            boxShadow="none"
            label={
              <Card bgColor="backgroundHighlight">
                <Text>{functionDisplay}</Text>
              </Card>
            }
            shouldWrapChildren
          >
            <Text fontFamily="mono" isTruncated maxW={150}>
              {functionDisplay}
            </Text>
          </Tooltip>
        );
      },
    }),
    columnHelper.accessor("transactionHash", {
      header: "Transaction Hash",
      cell: (cell) => {
        const { chainId, transactionHash } = cell.row.original;
        if (!chainId || !transactionHash) {
          return;
        }

        const chain = queryClient.getQueryData<Chain>([
          "chainDetails",
          chainId,
        ]);
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
            <LinkButton
              key={explorer.name}
              variant="ghost"
              isExternal
              size="xs"
              href={`${explorer.url}/tx/${transactionHash}`}
            >
              <Text fontFamily="mono" maxW="100px" isTruncated>
                {transactionHash}
              </Text>
            </LinkButton>
          );
        }

        queryClient.prefetchQuery(["chainDetails", chainId], () =>
          fetchChain(chainId),
        );
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

  return (
    <TWTable
      title="transactions"
      data={transactions}
      columns={columns}
      isLoading={isLoading}
      isFetched={isFetched}
    />
  );
};

const CancelTransactionButton = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = useApiAuthToken();
  const [instanceUrl] = useLocalStorage("engine-instance", "");
  const { onSuccess, onError } = useTxNotifications(
    "Successfully sent a request to cancel transaction",
    "Failed to cancel transaction",
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const onClickContinue = async () => {
    try {
      const resp = await fetch(`${instanceUrl}transaction/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
          "x-backend-wallet-address": transaction.fromAddress ?? "",
        },
        body: JSON.stringify({ queueId: transaction.queueId }),
      });
      if (!resp.ok) {
        const json = await resp.json();
        throw json.error?.message;
      }
      onSuccess();
    } catch (e) {
      console.error("Cancelling transaction:", e);
      onError(e);
    }

    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        initialFocusRef={closeButtonRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Transaction</ModalHeader>
          <ModalBody>
            <Stack gap={4}>
              <Text>Are you sure you want to cancel this transaction?</Text>
              <FormControl>
                <FormLabel>Queue ID</FormLabel>
                <Text fontFamily="mono">{transaction.queueId}</Text>
              </FormControl>
              <FormControl>
                <FormLabel>Submitted at</FormLabel>
                <Text>
                  {format(new Date(transaction.queuedAt ?? ""), "PP pp z")}
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel>From</FormLabel>
                <AddressCopyButton
                  address={transaction.fromAddress ?? ""}
                  size="xs"
                  shortenAddress={false}
                />
              </FormControl>
              <FormControl>
                <FormLabel>To</FormLabel>
                <AddressCopyButton
                  address={transaction.toAddress ?? ""}
                  size="xs"
                  shortenAddress={false}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Function</FormLabel>
                <Text fontFamily="mono">{transaction.functionName}</Text>
              </FormControl>

              <Text>
                If this transaction is already submitted, it may complete before
                the cancellation is submitted.
              </Text>
            </Stack>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              variant="ghost"
            >
              Close
            </Button>
            <Button type="submit" colorScheme="red" onClick={onClickContinue}>
              Cancel transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Tooltip
        borderRadius="md"
        bg="transparent"
        boxShadow="none"
        label={
          <Card bgColor="backgroundHighlight">
            <Text>Cancel transaction</Text>
          </Card>
        }
      >
        <IconButton
          aria-label="Cancel transaction"
          icon={<FiTrash />}
          colorScheme="red"
          variant="ghost"
          size="xs"
          onClick={onOpen}
        />
      </Tooltip>
    </>
  );
};
