import { Transaction } from "@3rdweb-sdk/react/hooks/useEngine";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { Badge, Text } from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("chainId", {
    header: "Chain ID",
    cell: (cell) => {
      return cell.getValue();
    },
  }),
  columnHelper.accessor("minedAt", {
    header: "Mined At",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return <Text>{toDateTimeLocal(value)}</Text>;
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (cell) => {
      const statusToColor: Record<string, string> = {
        processed: "yellow",
        queued: "yellow",
        sent: "yellow",
        "user-op-sent": "yellow",
        mined: "green",
        errored: "red",
        cancelled: "red",
      };

      const value = cell.getValue();

      if (!value) {
        return null;
      }

      return (
        <Badge
          borderRadius="full"
          size="label.sm"
          variant="subtle"
          px={3}
          py={1.5}
          colorScheme={statusToColor[value]}
        >
          {value === "user-op-sent" ? "User Op Sent" : value}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("transactionType", {
    header: "Type",
    cell: (cell) => {
      return cell.getValue();
    },
  }),
  columnHelper.accessor("queueId", {
    header: "Queue ID",
    cell: (cell) => {
      return cell.getValue();
    },
  }),
  columnHelper.accessor("transactionHash", {
    header: "Transaction Hash",
    cell: (cell) => {
      return cell.getValue();
    },
  }),
];

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  isFetched,
}) => {
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
