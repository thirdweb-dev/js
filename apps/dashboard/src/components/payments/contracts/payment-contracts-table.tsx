import {
  usePaymentsSellerById,
  validPaymentsChainIdsMainnets,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import type { Chain } from "@thirdweb-dev/chains";
import {
  AsyncContractNameCell,
  AsyncContractTypeCell,
} from "components/contract-components/tables/cells";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import type { BasicContract } from "contract-ui/types/types";
import { LinkButton, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { fetchChain } from "utils/fetchChain";
import { EnablePaymentsButton } from "../enable-payments-button";

interface PaymentContractsTableProps {
  paymentContracts: BasicContract[];
  paymentsSellerId: string;
  isLoading: boolean;
  isFetched: boolean;
}

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}

const columnHelper = createColumnHelper<BasicContract>();

export const PaymentContractsTable: React.FC<PaymentContractsTableProps> = ({
  paymentContracts,
  paymentsSellerId,
  isLoading,
  isFetched,
}) => {
  const queryClient = useQueryClient();
  const { data: sellerData } = usePaymentsSellerById(paymentsSellerId);

  const columns = [
    columnHelper.accessor((row) => row, {
      header: "Name",
      cell: (cell) => {
        return <AsyncContractNameCell cell={cell.row.original} />;
      },
    }),
    columnHelper.accessor((row) => row, {
      header: "Type",
      cell: (cell) => <AsyncContractTypeCell cell={cell.row.original} />,
    }),
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
              <Text>{cleanChainName(chain.name)}</Text>
            </Flex>
          );
        }

        queryClient.prefetchQuery(["chainDetails", chainId], () =>
          fetchChain(chainId),
        );
      },
    }),
    columnHelper.accessor("address", {
      header: "Address",
      cell: (cell) => {
        const address = cell.getValue();
        return <AddressCopyButton address={address} />;
      },
    }),
    columnHelper.accessor((row) => row.address, {
      header: "",
      id: "actions",
      cell: (cell) => {
        const contractAddress = cell.getValue();
        const chainId = cell.row.original.chainId;

        const isMainnet = validPaymentsChainIdsMainnets.includes(chainId ?? 0);

        if (isMainnet && !sellerData?.has_production_access) {
          return (
            <LinkButton
              variant="outline"
              size="sm"
              w="full"
              href="/dashboard/connect/pay?tab=contract-settings"
            >
              Verification Required
            </LinkButton>
          );
        }

        return (
          <EnablePaymentsButton
            contractAddress={contractAddress}
            chainId={chainId}
          />
        );
      },
    }),
  ];

  return (
    <TWTable
      title="contracts"
      data={paymentContracts}
      columns={columns}
      isLoading={isLoading}
      isFetched={isFetched}
      showMore={{
        pageSize: 10,
      }}
    />
  );
};
