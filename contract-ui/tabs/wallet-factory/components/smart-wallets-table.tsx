import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { createColumnHelper } from "@tanstack/react-table";
import { AccountEvent, useSmartWallets } from "@thirdweb-dev/react";
import { TWTable } from "components/shared/TWTable";
import { useRouter } from "next/router";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

const columnHelper = createColumnHelper<AccountEvent>();

const columns = [
  columnHelper.accessor("account", {
    header: "Smart Wallet",
    cell: (info) => (
      <AddressCopyButton address={info.getValue()} shortenAddress={false} />
    ),
  }),
  columnHelper.accessor("admin", {
    header: "Admin",
    cell: (info) => <AddressCopyButton address={info.getValue()} />,
  }),
];

interface SmartWalletsTableProps {
  smartWalletsQuery: ReturnType<typeof useSmartWallets>;
}

export const SmartWalletsTable: React.FC<SmartWalletsTableProps> = ({
  smartWalletsQuery,
}) => {
  const router = useRouter();
  const network = useDashboardEVMChainId();

  return (
    <TWTable
      title="smart wallet"
      columns={columns}
      data={smartWalletsQuery.data || []}
      isLoading={smartWalletsQuery.isLoading}
      isFetched={smartWalletsQuery.isFetched}
      onRowClick={(row) => {
        router.push(`/${network}/${row.account}`);
      }}
    />
  );
};
