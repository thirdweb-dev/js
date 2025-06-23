"use client";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  nextTokenIdToMint,
  startTokenId,
  totalSupply,
} from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";
import { StatCard } from "../../overview/components/stat-card";

interface SupplyCardsProps {
  contract: ThirdwebContract;
}

export const SupplyCards: React.FC<SupplyCardsProps> = ({ contract }) => {
  const nextTokenIdQuery = useReadContract(nextTokenIdToMint, {
    contract,
  });

  const totalSupplyQuery = useReadContract(totalSupply, {
    contract,
  });

  const startTokenIdQuery = useReadContract(startTokenId, { contract });

  const realTotalSupply = useMemo(
    () => (nextTokenIdQuery.data || 0n) - (startTokenIdQuery.data || 0n),
    [nextTokenIdQuery.data, startTokenIdQuery.data],
  );

  const unclaimedSupply = useMemo(
    () => (realTotalSupply - (totalSupplyQuery?.data || 0n)).toString(),
    [realTotalSupply, totalSupplyQuery.data],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <StatCard
        isPending={nextTokenIdQuery.isPending}
        label="Total Supply"
        value={realTotalSupply.toString()}
      />
      <StatCard
        isPending={totalSupplyQuery.isPending}
        label="Claimed Supply"
        value={totalSupplyQuery?.data?.toString() || "N/A"}
      />
      <StatCard
        isPending={totalSupplyQuery.isPending || nextTokenIdQuery.isPending}
        label="Unclaimed Supply"
        value={unclaimedSupply}
      />
    </div>
  );
};
