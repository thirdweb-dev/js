import { Skeleton } from "@chakra-ui/react";
import { memo } from "react";
import { Text } from "tw-components";
import { useQuery } from "@tanstack/react-query";
import { getThirdwebSDK } from "lib/sdk";
import { useAllChainsData } from "hooks/chains/allChains";
import { getDashboardChainRpc } from "lib/rpc";
import { BasicContract } from "contract-ui/types/types";

interface AsyncFactoryAccountCellProps {
  cell: BasicContract;
}

const useAccountCount = (address: string, chainId: number) => {
  const { chainIdToChainRecord } = useAllChainsData();
  return useQuery({
    queryKey: ["account-count", chainId, address],
    queryFn: async () => {
      const chain = chainIdToChainRecord[chainId];
      if (!chain) {
        throw new Error("chain not found");
      }
      const sdk = getThirdwebSDK(chainId, getDashboardChainRpc(chain));
      const contract = await sdk.getContract(address);
      const accounts = await contract.accountFactory.getAllAccounts();
      return accounts.length;
    },
    enabled: !!address && !!chainId,
  });
};

export const AsyncFactoryAccountCell = memo(
  ({ cell }: AsyncFactoryAccountCellProps) => {
    const accountsQuery = useAccountCount(cell.address, cell.chainId);
    return (
      <Skeleton isLoaded={!accountsQuery.isLoading}>
        <Text size="label.md">{accountsQuery.data || 0}</Text>
      </Skeleton>
    );
  },
);

AsyncFactoryAccountCell.displayName = "AsyncFactirtAccountCell";
