import { Transaction } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, Tag, TagLabel, Tooltip } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { Chain } from "@thirdweb-dev/chains";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { format, formatDistanceToNowStrict } from "date-fns";
import { FiInfo } from "react-icons/fi";
import { LinkButton, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { fetchChain } from "utils/fetchChain";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isFetched: boolean;
}

const statusDetails: Record<
  string,
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
        const { status, errorMessage, minedAt } = cell.row.original;
        if (!status) {
          return null;
        }

        const tooltip =
          status === "errored"
            ? errorMessage
            : status === "mined" && minedAt
            ? `Completed ${format(new Date(minedAt), "PP pp")}`
            : undefined;

        return (
          <Tooltip label={tooltip}>
            <Tag
              size="sm"
              variant="subtle"
              colorScheme={statusDetails[status].colorScheme}
              gap={2}
            >
              <TagLabel>{statusDetails[status].name}</TagLabel>
              {statusDetails[status].showTooltipIcon && <FiInfo />}
            </Tag>
          </Tooltip>
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

        return (
          <Text fontFamily="mono">
            {extension === "none"
              ? functionName
              : `${extension} ${functionName}`}
          </Text>
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
      header: "Queued At",
      cell: (cell) => {
        const value = cell.getValue();
        if (!value) {
          return;
        }

        const date = new Date(value);
        return (
          <Tooltip label={format(date, "PP pp z")} shouldWrapChildren>
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
