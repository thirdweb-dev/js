import { Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { ClaimConditions } from "./components/claim-conditions";

interface ContractClaimConditionsPageProps {
  contract: ThirdwebContract;
  isERC20: boolean;
}

export const ContractClaimConditionsPage: React.FC<
  ContractClaimConditionsPageProps
> = ({ contract, isERC20 }) => {
  return (
    <Flex direction="column" gap={6}>
      <ClaimConditions contract={contract} isERC20={isERC20} />
    </Flex>
  );
};
