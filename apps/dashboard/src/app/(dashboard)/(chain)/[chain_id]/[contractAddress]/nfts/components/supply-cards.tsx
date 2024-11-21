"use client";

import { Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  nextTokenIdToMint,
  startTokenId,
  totalSupply,
} from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";
import { Card } from "tw-components";

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
    <div className="flex flex-col gap-3 md:flex-row md:gap-6">
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Total Supply</StatLabel>
        <Skeleton isLoaded={nextTokenIdQuery.isSuccess}>
          <StatNumber>{realTotalSupply.toString()}</StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Claimed Supply</StatLabel>
        <Skeleton isLoaded={totalSupplyQuery.isSuccess}>
          <StatNumber>{totalSupplyQuery?.data?.toString()}</StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Unclaimed Supply</StatLabel>
        <Skeleton
          isLoaded={totalSupplyQuery.isSuccess && nextTokenIdQuery.isSuccess}
        >
          <StatNumber>{unclaimedSupply}</StatNumber>
        </Skeleton>
      </Card>
    </div>
  );
};
