"use client";

import { memo } from "react";
import { getContract, type ThirdwebClient } from "thirdweb";
import { getAllAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";

function useAccountCount(
  address: string,
  chainId: number,
  client: ThirdwebClient,
) {
  const chain = useV5DashboardChain(chainId);
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

export const FactoryAccountCell = memo(function FactoryAccountCell(props: {
  chainId: string;
  contractAddress: string;
  client: ThirdwebClient;
}) {
  const accountsQuery = useAccountCount(
    props.contractAddress,
    Number(props.chainId),
    props.client,
  );
  return (
    <SkeletonContainer
      loadedData={accountsQuery.data?.length}
      render={(v) => {
        return <span> {v}</span>;
      }}
      skeletonData={100}
    />
  );
});
