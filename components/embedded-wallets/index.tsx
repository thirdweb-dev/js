import { EmbeddedWalletUser } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface EmbeddedWalletsTableProps {
  wallets: EmbeddedWalletUser[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<EmbeddedWalletUser>();

const columns = [
  columnHelper.accessor("ews_authed_user", {
    header: "Email",
    enableColumnFilter: true,
    cell: (cell) => <Text>{cell.getValue()?.[0]?.email}</Text>,
  }),
  columnHelper.accessor("embedded_wallet", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue()?.[0]?.address;
      return address ? <AddressCopyButton address={address} /> : null;
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return <Text>{format(new Date(value), "MMM dd, yyyy")}</Text>;
    },
  }),
  columnHelper.accessor("last_accessed_at", {
    header: "Last login",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return <Text>{format(new Date(value), "MMM dd, yyyy")}</Text>;
    },
  }),
];

export const EmbeddedWalletsTable: React.FC<EmbeddedWalletsTableProps> = ({
  wallets,
  isLoading,
  isFetched,
}) => {
  return (
    <TWTable
      title="active embedded wallets"
      data={wallets}
      columns={columns}
      isLoading={isLoading}
      isFetched={isFetched}
    />
  );
};
