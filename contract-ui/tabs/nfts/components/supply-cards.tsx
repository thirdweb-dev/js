import { Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
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
  const { data: claimedSupply } = useClaimedNFTSupply(contract);
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(contract);

  return (
    <Stack direction="row" spacing={6}>
      <Card as={Stat}>
        <StatLabel>Total Supply</StatLabel>
        <StatNumber>
          {claimedSupply?.add(BigNumber.from(unclaimedSupply || 0)).toString()}
        </StatNumber>
      </Card>
      <Card as={Stat}>
        <StatLabel>Claimed Supply</StatLabel>
        <StatNumber>{claimedSupply?.toString()}</StatNumber>
      </Card>
      <Card as={Stat}>
        <StatLabel>Unclaimed Supply</StatLabel>
        <StatNumber>{unclaimedSupply?.toString()}</StatNumber>
      </Card>
    </Stack>
  );
};
