import { Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { AsyncContractNameCell } from "components/contract-components/tables/cells";
import { TWTable } from "components/shared/TWTable";
import { AsyncFactoryAccountCell } from "components/smart-wallets/AccountFactories/account-cell";
import type { BasicContract } from "contract-ui/types/types";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getChainMetadata } from "thirdweb/chains";
import { Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface FactoryContractsProps {
  contracts: BasicContract[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<BasicContract>();

const columns = [
  columnHelper.accessor((row) => row.address, {
    header: "Name",
    cell: (cell) => <AsyncContractNameCell cell={cell.row.original} />,
  }),
  columnHelper.accessor("chainId", {
    header: "Network",
    cell: (cell) => {
      return <NetworkName id={cell.getValue()} />;
    },
  }),
  columnHelper.accessor("address", {
    header: "Contract address",
    cell: (cell) => <Text>{shortenIfAddress(cell.getValue())}</Text>,
  }),
  columnHelper.accessor((row) => row, {
    header: "Accounts",
    cell: (cell) => {
      return <AsyncFactoryAccountCell cell={cell.row.original} />;
    },
  }),
];

function NetworkName(props: { id: number }) {
  const chain = useV5DashboardChain(props.id);
  const chainQuery = useQuery({
    queryKey: ["getChainByChainIdAsync", props.id],
    queryFn: () => getChainMetadata(chain),
  });

  return (
    <Skeleton isLoaded={!!chainQuery.data}>
      <Text>{chainQuery.data?.name || "..."}</Text>
    </Skeleton>
  );
}

export const FactoryContracts: React.FC<FactoryContractsProps> = ({
  contracts,
  isLoading,
  isFetched,
}) => {
  return (
    <TWTable
      title="account factories"
      data={contracts}
      columns={columns}
      isLoading={isLoading}
      isFetched={isFetched}
    />
  );
};
