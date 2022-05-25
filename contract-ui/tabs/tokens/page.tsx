import { TokenMintButton } from "./components/mint-button";
import { TokenSupply } from "./components/supply";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Erc20, SmartContract, ValidContractInstance } from "@thirdweb-dev/sdk";
import React from "react";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface ContractTokenPageProps {
  contractAddress?: string;
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contractAddress,
  // passedContract,
}) => {
  const contract = useContract(contractAddress);

  const detectedContract = detectErc20Instance(contract.contract);
  console.log("*** ContractNFTPage", { detectedContract });

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedContract) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Token extension enabled</Heading>
        <Text>
          To enable Token features you will have to extend the required
          interfaces in your contract.
        </Text>

        <Divider my={1} borderColor="borderColor" />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/erc20"
            >
              ERC20
            </LinkButton>
          </ButtonGroup>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract NFTs</Heading>
      </Flex>

      <TokenMintButton contract={detectedContract} />
      <TokenSupply contract={detectedContract} />
    </Flex>
  );
};

export function detectErc20Instance(
  contract: ValidContractInstance | SmartContract | null | undefined,
) {
  if (!contract) {
    return undefined;
  }
  if (contract instanceof Erc20) {
    return contract;
  }
  if ("token" in contract && contract.token instanceof Erc20) {
    return contract.token;
  }
  return undefined;
}
