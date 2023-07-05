import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { Flex } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { AccountEvent, useAccounts, useAddress } from "@thirdweb-dev/react";
import { TWTable } from "components/shared/TWTable";
import { useRouter } from "next/router";
import { Text, TrackedCopyButton } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

const columnHelper = createColumnHelper<AccountEvent>();

const columns = [
  columnHelper.accessor("account", {
    header: "Account",
    cell: (info) => (
      <Flex gap={2} align="center">
        <Text fontFamily="mono">{info.getValue()}</Text>
        <TrackedCopyButton
          value={info.getValue()}
          category="accounts"
          aria-label="Copy account address"
          colorScheme="primary"
        />
      </Flex>
    ),
  }),
  columnHelper.accessor("admin", {
    header: "Admin",
    cell: (info) => (
      <Flex gap={2} align="center">
        <Text fontFamily="mono">{shortenIfAddress(info.getValue())}</Text>
        <TrackedCopyButton
          value={info.getValue()}
          category="accounts"
          aria-label="Copy admin address"
          colorScheme="primary"
        />
      </Flex>
    ),
  }),
];

interface AccountsTableProps {
  accountsQuery: ReturnType<typeof useAccounts>;
  accountsForAddress?: string[];
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
  accountsQuery,
  accountsForAddress,
}) => {
  const router = useRouter();
  const network = useDashboardEVMChainId();
  const address = useAddress();

  const defaultAccounts: AccountEvent[] = (accountsForAddress || []).map(
    (account: string) => ({
      account,
      admin: address || "",
    }),
  );

  return (
    <TWTable
      title="account"
      columns={columns}
      data={accountsQuery.data || defaultAccounts}
      isLoading={accountsQuery.isLoading}
      isFetched={accountsQuery.isFetched}
      onRowClick={(row) => {
        router.push(`/${network}/${row.account}`);
      }}
    />
  );
};
