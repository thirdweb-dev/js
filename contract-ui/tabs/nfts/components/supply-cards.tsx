import { Skeleton, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import {
  DropContract,
  useClaimedNFTSupply,
  useUnclaimedNFTSupply,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { Card } from "tw-components";

interface SupplyCardsProps {
  contract: DropContract;
}

export const SupplyCards: React.FC<SupplyCardsProps> = ({ contract }) => {
  const claimedSupplyQuery = useClaimedNFTSupply(contract);
  const unclaimedSupplyQuery = useUnclaimedNFTSupply(contract);

  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={6}>
      <Card as={Stat}>
        <StatLabel>Total Supply</StatLabel>
        <Skeleton
          isLoaded={
            claimedSupplyQuery.isSuccess && unclaimedSupplyQuery.isSuccess
          }
        >
          <StatNumber>
            {BigNumber.from(claimedSupplyQuery?.data || 0)
              .add(BigNumber.from(unclaimedSupplyQuery?.data || 0))
              .toString()}
          </StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel>Claimed Supply</StatLabel>
        <Skeleton isLoaded={claimedSupplyQuery.isSuccess}>
          <StatNumber>
            {BigNumber.from(claimedSupplyQuery?.data || 0).toString()}
          </StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel>Unclaimed Supply</StatLabel>
        <Skeleton isLoaded={unclaimedSupplyQuery.isSuccess}>
          <StatNumber>
            {BigNumber.from(unclaimedSupplyQuery?.data || 0).toString()}
          </StatNumber>
        </Skeleton>
      </Card>
    </Stack>
  );
};
