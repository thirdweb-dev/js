import { Flex } from "@chakra-ui/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { Heading } from "tw-components";

interface ContractTokenPageProps {
  contract: Erc20;
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contract,
}) => {
  console.log("token contract", contract);
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Tokens</Heading>
        {/* TODO build everything erc20 token-based in here */}
      </Flex>
    </Flex>
  );
};
