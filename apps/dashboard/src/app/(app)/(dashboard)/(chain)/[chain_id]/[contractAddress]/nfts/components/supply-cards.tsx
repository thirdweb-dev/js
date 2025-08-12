"use client";
import type { ThirdwebContract } from "thirdweb";
import {
  getTotalClaimedSupply,
  totalSupply as getTotalSupply,
  getTotalUnclaimedSupply,
} from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";
import { StatCard } from "../../overview/components/stat-card";

interface SupplyCardsProps {
  contract: ThirdwebContract;
}

export const SupplyCards: React.FC<SupplyCardsProps> = ({ contract }) => {
  const totalSupplyQuery = useReadContract(getTotalSupply, {
    contract,
  });

  const totalClaimedSupplyQuery = useReadContract(getTotalClaimedSupply, {
    contract,
  });

  const totalUnClaimedSupplyQuery = useReadContract(getTotalUnclaimedSupply, {
    contract,
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <StatCard
        isPending={totalSupplyQuery.isPending}
        label="Total Supply"
        value={totalSupplyQuery.data?.toString() || "N/A"}
      />
      <StatCard
        isPending={totalClaimedSupplyQuery.isPending}
        label="Claimed Supply"
        value={totalClaimedSupplyQuery.data?.toString() || "N/A"}
      />
      <StatCard
        isPending={totalUnClaimedSupplyQuery.isPending}
        label="Unclaimed Supply"
        value={totalUnClaimedSupplyQuery.data?.toString() || "N/A"}
      />
    </div>
  );
};
