import { Skeleton, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import {
  DropContract,
  EditionDrop,
  TokenDrop,
  useClaimedNFTSupply,
  useUnclaimedNFTSupply,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { Card } from "tw-components";

interface SupplyCardsProps {
  contract: Exclude<DropContract, EditionDrop | TokenDrop>;
}

export const SupplyCards: React.FC<SupplyCardsProps> = ({ contract }) => {
  const claimedSupplyQuery = useClaimedNFTSupply(contract);
  const unclaimedSupplyQuery = useUnclaimedNFTSupply(contract);

  return (
    <Stack spacing={{ base: 3, md: 6 }} direction="row">
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Total Supply</StatLabel>
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
        <StatLabel mb={{ base: 1, md: 0 }}>Claimed Supply</StatLabel>
        <Skeleton isLoaded={claimedSupplyQuery.isSuccess}>
          <StatNumber>
            {BigNumber.from(claimedSupplyQuery?.data || 0).toString()}
          </StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Unclaimed Supply</StatLabel>
        <Skeleton isLoaded={unclaimedSupplyQuery.isSuccess}>
          <StatNumber>
            {BigNumber.from(unclaimedSupplyQuery?.data || 0).toString()}
          </StatNumber>
        </Skeleton>
      </Card>
    </Stack>
  );
};
