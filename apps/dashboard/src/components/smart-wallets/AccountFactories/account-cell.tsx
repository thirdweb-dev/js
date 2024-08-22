import { thirdwebClient } from "@/constants/client";
import { Skeleton } from "@chakra-ui/react";
import type { BasicContract } from "contract-ui/types/types";
import { useV5DashboardChain } from "lib/v5-adapter";
import { memo } from "react";
import { getContract } from "thirdweb";
import { getAllAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { Text } from "tw-components";

interface AsyncFactoryAccountCellProps {
  cell: BasicContract;
}

function useAccountCount(address: string, chainId: number) {
  const dashboardChain = useV5DashboardChain(chainId);
  return useReadContract(getAllAccounts, {
    contract: getContract({
      chain: dashboardChain,
      address,
      client: thirdwebClient,
    }),
  });
}

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
