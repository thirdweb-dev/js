import { ContractWithMetadata } from "@thirdweb-dev/react";
import { createColumnHelper } from "@tanstack/react-table";
import { getChainByChainId } from "@thirdweb-dev/chains";
import { TWTable } from "components/shared/TWTable";
import { Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
import { AsyncFactoryAccountCell } from "components/smart-wallets/AccountFactories/account-cell";
import { AsyncContractNameCell } from "components/contract-components/tables/cells";

interface FactoryContractsProps {
  contracts: ContractWithMetadata[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<ContractWithMetadata>();

const columns = [
  columnHelper.accessor((row) => row.metadata, {
    header: "Name",
    cell: (cell) => <AsyncContractNameCell cell={cell.row.original} />,
  }),
  columnHelper.accessor("chainId", {
    header: "Network",
    cell: (cell) => <Text>{getChainByChainId(cell.getValue()).name}</Text>,
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
