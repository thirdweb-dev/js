import { Skeleton, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { Card } from "tw-components";
import { totalSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";

interface SupplyCardsProps {
  contract: ThirdwebContract;
}

export const SupplyCards: React.FC<SupplyCardsProps> = ({ contract }) => {
  const claimedSupplyQuery = useReadContract(totalSupply, {
    contract,
  });
  const totalSupplyQuery = useReadContract(nextTokenIdToMint, {
    contract,
  });

  const unclaimedSupply = (
    (totalSupplyQuery?.data || 0n) - (claimedSupplyQuery?.data || 0n)
  ).toString();

  return (
    <Stack spacing={{ base: 3, md: 6 }} direction="row">
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Total Supply</StatLabel>
        <Skeleton isLoaded={totalSupplyQuery.isSuccess}>
          <StatNumber>{totalSupplyQuery?.data?.toString()}</StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Claimed Supply</StatLabel>
        <Skeleton isLoaded={claimedSupplyQuery.isSuccess}>
          <StatNumber>{claimedSupplyQuery?.data?.toString()}</StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Unclaimed Supply</StatLabel>
        <Skeleton
          isLoaded={totalSupplyQuery.isSuccess && claimedSupplyQuery.isSuccess}
        >
          <StatNumber>{unclaimedSupply}</StatNumber>
        </Skeleton>
      </Card>
    </Stack>
  );
};
