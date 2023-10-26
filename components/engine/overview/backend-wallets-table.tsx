import {
  BackendWallet,
  useEngineBackendWalletBalance,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface BackendWalletsTableProps {
  wallets: BackendWallet[];
  instance: string;
  isLoading: boolean;
  isFetched: boolean;
}

interface BackendWalletDashboard extends BackendWallet {
  balance: string;
}

const columnHelper = createColumnHelper<BackendWalletDashboard>();

const setColumns = (instance: string) => [
  columnHelper.accessor("address", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue();
      return (
        <AddressCopyButton address={address} shortenAddress={false} size="xs" />
      );
    },
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
  }),
  columnHelper.accessor("address", {
    header: "Balance",
    cell: (cell) => {
      const address = cell.getValue();
      return <BackendWalletBalanceCell instance={instance} address={address} />;
    },
    id: "balance",
  }),
];

interface BackendWalletBalanceCellProps {
  instance: string;
  address: string;
}

const BackendWalletBalanceCell: React.FC<BackendWalletBalanceCellProps> = ({
  instance,
  address,
}) => {
  const { data: backendWalletBalance } = useEngineBackendWalletBalance(
    instance,
    address,
  );

  return (
    <Text>
      {parseFloat(backendWalletBalance?.displayValue ?? "0").toFixed(6)}{" "}
      {backendWalletBalance?.symbol}
    </Text>
  );
};

export const BackendWalletsTable: React.FC<BackendWalletsTableProps> = ({
  wallets,
  instance,
  isLoading,
  isFetched,
}) => {
  const columns = setColumns(instance);

  return (
    <TWTable
      title="backend wallets"
      data={wallets}
      columns={columns as ColumnDef<BackendWallet, string>[]}
      isLoading={isLoading}
      isFetched={isFetched}
    />
  );
};
