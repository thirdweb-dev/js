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
    <div className="flex flex-row gap-3 md:gap-6 [&>*]:grow">
      <StatCard
        value={realTotalSupply.toString()}
        label="Total Supply"
        isPending={nextTokenIdQuery.isPending}
      />
      <StatCard
        value={totalSupplyQuery?.data?.toString() || "N/A"}
        label="Claimed Supply"
        isPending={totalSupplyQuery.isPending}
      />
      <StatCard
        value={unclaimedSupply}
        label="Unclaimed Supply"
        isPending={totalSupplyQuery.isPending || nextTokenIdQuery.isPending}
      />
    </div>
  );
};
