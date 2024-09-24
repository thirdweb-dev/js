"use client";

import { SkeletonContainer } from "@/components/ui/skeleton";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import type { BasicContract } from "contract-ui/types/types";
import { memo } from "react";
import { getContract } from "thirdweb";
import { getAllAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { useV5DashboardChain } from "../../../lib/v5-adapter";

interface AsyncFactoryAccountCellProps {
  cell: BasicContract;
}

function useAccountCount(address: string, chainId: number) {
  const chain = useV5DashboardChain(chainId);
  const client = useThirdwebClient();
  const contract = getContract({
    address,
    chain,
    client,
  });

  return useReadContract(getAllAccounts, {
    contract,
    queryOptions: {
      enabled: !!address && !!chain,
    },
  });
}

export const AsyncFactoryAccountCell = memo(
  ({ cell }: AsyncFactoryAccountCellProps) => {
    const accountsQuery = useAccountCount(cell.address, cell.chainId);
    return (
      <SkeletonContainer
        loadedData={accountsQuery.data?.length}
        skeletonData={0}
        render={(v) => {
          return <span> {v}</span>;
        }}
      />
    );
  },
);

AsyncFactoryAccountCell.displayName = "AsyncFactoryAccountCell";
