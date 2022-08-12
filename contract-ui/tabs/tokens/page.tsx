import { TokenAirdropButton } from "./components/airdrop-button";
import { TokenMintButton } from "./components/mint-button";
import { TokenSupply } from "./components/supply";
import { TokenTransferButton } from "./components/transfer-button";
import { ButtonGroup, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import { PotentialContractInstance } from "contract-ui/types/types";
import React from "react";
import { Card, Heading, Text } from "tw-components";
import { TokenBurnButton } from "./components/burn-button";

interface ContractTokenPageProps {
  contractAddress?: string;
}

export const ContractTokensPage: React.FC<ContractTokenPageProps> = ({
  contractAddress,
}) => {
  const contract = useContract(contractAddress);

  const detectedContract = detectErc20Instance(contract.contract);

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
          To enable Token features you will have to extend an ERC20 interface in
          your contract.
        </Text>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Tokens</Heading>
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w="inherit"
        >
          <TokenBurnButton contract={detectedContract} />
          <TokenAirdropButton contract={detectedContract} />
          <TokenTransferButton contract={detectedContract} />
          <TokenMintButton contract={detectedContract} />
        </ButtonGroup>
      </Flex>

      <TokenSupply contract={detectedContract} />
    </Flex>
  );
};

export function detectErc20Instance(contract: PotentialContractInstance) {
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
