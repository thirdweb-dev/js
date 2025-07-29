"use client";

import type { ThirdwebContract } from "thirdweb";
import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { useSplitBalances } from "@/hooks/useSplit";
import { StatCard } from "../../overview/components/stat-card";

export function AccountBalance(props: { contract: ThirdwebContract }) {
  const activeChain = useActiveWalletChain();
  const { data: balance } = useWalletBalance({
    address: props.contract.address,
    chain: activeChain,
    client: props.contract.client,
  });

  const balanceQuery = useSplitBalances(props.contract);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <StatCard
        label={balance?.symbol || ""}
        value={balance?.displayValue || ""}
        isPending={balanceQuery.isPending}
      />
      {balanceQuery?.data
        ?.filter((bl) => bl.name !== "Native Token")
        .map((bl) => (
          <StatCard
            key={bl.symbol}
            label={bl.symbol}
            value={bl.display_balance}
            isPending={false}
          />
        ))}
    </div>
  );
}
