"use client";

import type { ThirdwebContract } from "thirdweb";
import { useOwnedTokenBalances } from "@/hooks/useSplit";
import { StatCard } from "../../overview/components/stat-card";

export function AccountBalance(props: { contract: ThirdwebContract }) {
  const balanceQuery = useOwnedTokenBalances({
    ownerAddress: props.contract.address,
    client: props.contract.client,
    chain: props.contract.chain,
  });

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {balanceQuery?.data?.map((bl) => (
        <StatCard
          key={bl.symbol}
          label={bl.symbol}
          value={bl.displayValue}
          isPending={false}
        />
      ))}
    </div>
  );
}
