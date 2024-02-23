import {
  PrebuiltContractType,
  SchemaForPrebuiltContractType,
} from "@thirdweb-dev/sdk";

import { Skeleton } from "@chakra-ui/react";

import React, { memo } from "react";

import { Text } from "tw-components";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getEVMThirdwebSDK } from "lib/sdk";
import { useAllChainsData } from "hooks/chains/allChains";
import { getDashboardChainRpc } from "lib/rpc";

interface AsyncFactoryAccountCellProps {
  cell: {
    address: string;
    chainId: number;
    metadata: () => Promise<
      z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
    >;
  };
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
      const sdk = getEVMThirdwebSDK(chainId, getDashboardChainRpc(chain));
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
