import { NFTMintButton } from "./components/mint-button";
import { NftGetAllTable } from "./components/table";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { NFTContract, useContract } from "@thirdweb-dev/react";
import { Erc721, Erc1155 } from "@thirdweb-dev/sdk";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { PotentialContractInstance } from "contract-ui/types/types";
import React from "react";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface NftOverviewPageProps {
  contractAddress?: string;
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contractAddress,
  // passedContract,
}) => {
  const contract = useContract(contractAddress);

  const detectedContract = detectNFTContractInstance(contract.contract);
  const detectedSupply = detectSupply(contract.contract?.nft);

  const detectedState = extensionDetectedState({
    contract,
    feature: ["ERC721Enumerable", "ERC1155Enumerable"],
  });

  const enabled = detectedState === "enabled" || detectedSupply;

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedContract || !enabled) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Enumerable extension enabled</Heading>
        <Text>
          To being able to see the list of the NFTs minted on your contract, you
          will have to extend the required interfaces in your contract.
        </Text>

        <Divider my={1} borderColor="borderColor" />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-extensions/erc721#erc721enumerable"
            >
              ERC721Enumerable
            </LinkButton>
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-extensions/erc721#erc721enumerable"
            >
              ERC1155Enumerable
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
        <NFTMintButton contract={detectedContract} />
      </Flex>
      {enabled && <NftGetAllTable contract={detectedContract} />}
    </Flex>
  );
};

export function detectErc721Instance(contract: PotentialContractInstance) {
  if (!contract) {
    return undefined;
  }
  if (contract instanceof Erc721) {
    return contract;
  }
  if ("nft" in contract && contract.nft instanceof Erc721) {
    return contract.nft;
  }
  return undefined;
}

export function detectErc1155Instance(contract: PotentialContractInstance) {
  if (!contract) {
    return undefined;
  }
  if (contract instanceof Erc1155) {
    return contract;
  }
  if ("edition" in contract && contract.edition instanceof Erc1155) {
    return contract.edition;
  }
  return undefined;
}

export function detectNFTContractInstance(contract: PotentialContractInstance) {
  return detectErc721Instance(contract) || detectErc1155Instance(contract);
}

export function detectSupply(contract?: NFTContract) {
  if (!contract) {
    return undefined;
  }
  if ("query" in contract) {
    return contract?.query;
  }
  return undefined;
}
