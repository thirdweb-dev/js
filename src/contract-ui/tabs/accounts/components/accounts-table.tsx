import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { Flex } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useAccounts } from "@thirdweb-dev/react";
import { TWTable } from "components/shared/TWTable";
import { useRouter } from "next/router";
import { Text, TrackedCopyButton } from "tw-components";

const columnHelper = createColumnHelper<{ account: string }>();

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
];

interface AccountsTableProps {
  accountsQuery: ReturnType<typeof useAccounts>;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
  accountsQuery,
}) => {
  const router = useRouter();
  const network = useDashboardEVMChainId();

  const data = accountsQuery.data || [];

  return (
    <TWTable
      title="account"
      columns={columns}
      data={data.map((account) => ({ account }))}
      showMore={{
        pageSize: 50,
      }}
      isLoading={accountsQuery.isLoading}
      isFetched={accountsQuery.isFetched}
      onRowClick={(row) => {
        router.push(`/${network}/${row.account}`);
      }}
    />
  );
};
