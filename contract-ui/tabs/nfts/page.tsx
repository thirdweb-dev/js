import { NFTMintButton } from "./components/mint-button";
import { NftGetAllTable } from "./components/table";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import {
  Erc721,
  Erc1155,
  SmartContract,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
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
  console.log("*** ContractNFTPage", { detectedContract });

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedContract) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No NFT extension enabled</Heading>
        <Text>
          To enable NFT features you will have to extend the required interfaces
          in your contract.
        </Text>

        <Divider my={1} borderColor="borderColor" />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/erc721"
            >
              ERC721
            </LinkButton>
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-features/erc1155"
            >
              ERC1155
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
        {/* TODO add erc721 & 1155 mint flow here */}
      </Flex>
      {/* TODO check if this is supported before rendering it */}

      <NFTMintButton contract={detectedContract} />
      <NftGetAllTable contract={detectedContract} />
    </Flex>
  );
};

export function detectErc721Instance(
  contract: ValidContractInstance | SmartContract | null | undefined,
) {
  if (!contract) {
    return undefined;
  }
  if (contract instanceof Erc721) {
    console.log("*** detect extended contract", contract);
    return contract;
  }
  if ("nft" in contract && contract.nft instanceof Erc721) {
    console.log("*** detect extended contract nft", contract);
    return contract.nft;
  }
  return undefined;
}

export function detectErc1155Instance(
  contract: ValidContractInstance | SmartContract | null | undefined,
) {
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

export function detectNFTContractInstance(
  contract: ValidContractInstance | SmartContract | null | undefined,
) {
  return detectErc721Instance(contract) || detectErc1155Instance(contract);
}
