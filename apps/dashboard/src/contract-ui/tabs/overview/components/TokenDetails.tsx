import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { TokenSupply } from "contract-ui/tabs/tokens/components/supply";
import { Heading } from "tw-components";

interface TokenDetailsProps {
  contractAddress: string;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);

  return (
    <Flex direction="column" gap={6}>
      <Flex align="center" justify="space-between" w="full">
        <Heading size="title.sm">Token Details</Heading>
      </Flex>
      <TokenSupply contractQuery={contractQuery} />
    </Flex>
  );
};
