import { TokenSupply } from "../../tokens/components/supply";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
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
