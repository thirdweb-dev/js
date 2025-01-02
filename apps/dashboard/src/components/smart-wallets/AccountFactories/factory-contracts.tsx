"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { AsyncContractNameCell } from "components/contract-components/tables/cells";
import { TWTable } from "components/shared/TWTable";
import { AsyncFactoryAccountCell } from "components/smart-wallets/AccountFactories/account-cell";
import type { BasicContract } from "contract-ui/types/types";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getChainMetadata } from "thirdweb/chains";

interface FactoryContractsProps {
  contracts: BasicContract[];
  isPending: boolean;
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
    cell: (cell) => (
      <CopyAddressButton
        address={cell.getValue()}
        copyIconPosition="left"
        variant="ghost"
        className="-translate-x-2"
      />
    ),
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
    <SkeletonContainer
      className="inline-block"
      loadedData={chainQuery.data?.name}
      skeletonData="Ethereum Mainnet"
      render={(v) => {
        return <p className="text-muted-foreground text-sm">{v}</p>;
      }}
    />
  );
}

export const FactoryContracts: React.FC<FactoryContractsProps> = ({
  contracts,
  isPending,
  isFetched,
}) => {
  return (
    <TWTable
      title="account factories"
      data={contracts}
      columns={columns}
      isPending={isPending}
      isFetched={isFetched}
    />
  );
};
