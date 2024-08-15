import { Flex } from "@chakra-ui/react";
import { TokenSupply } from "contract-ui/tabs/tokens/components/supply";
import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";

interface TokenDetailsProps {
  contract: ThirdwebContract;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({ contract }) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex align="center" justify="space-between" w="full">
        <Heading size="title.sm">Token Details</Heading>
      </Flex>
      <TokenSupply contract={contract} />
    </Flex>
  );
};
