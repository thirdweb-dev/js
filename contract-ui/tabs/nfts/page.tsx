import { BatchLazyMintButton } from "./components/batch-lazy-mint-button";
import { NFTClaimButton } from "./components/claim-button";
import { NFTLazyMintButton } from "./components/lazy-mint-button";
import { NFTMintButton } from "./components/mint-button";
import { NFTRevealButton } from "./components/reveal-button";
import { SupplyCards } from "./components/supply-cards";
import { NFTGetAllTable } from "./components/table";
import { Box, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface NftOverviewPageProps {
  contractAddress?: string;
}

export const ContractNFTPage: React.FC<NftOverviewPageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);

  const detectedState = detectFeatures(contractQuery?.contract, [
    "ERC721Enumerable",
    "ERC1155Enumerable",
    "ERC721Supply",
  ]);

  const isErc721 = detectFeatures(contractQuery?.contract, ["ERC721"]);

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!contractQuery?.contract) {
    return null;
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract NFTs</Heading>
        <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
          <NFTRevealButton contractQuery={contractQuery} />
          <NFTClaimButton contractQuery={contractQuery} />
          <NFTMintButton contractQuery={contractQuery} />
          <NFTLazyMintButton contractQuery={contractQuery} />
          <BatchLazyMintButton contractQuery={contractQuery} />
        </Flex>
      </Flex>
      {!detectedState ? (
        <Card as={Flex} flexDir="column" gap={3}>
          {/* TODO  extract this out into it's own component and make it better */}
          <Heading size="subtitle.md">No Supply extension enabled</Heading>
          <Text>
            To being able to see the list of the NFTs minted on your contract,
            you will have to extend the ERC721Supply extension in your contract.
          </Text>
          <Box>
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/contractkit/interfaces/erc721supply"
              colorScheme="purple"
            >
              Learn more
            </LinkButton>
          </Box>
        </Card>
      ) : (
        <>
          {isErc721 && <SupplyCards contract={contractQuery.contract} />}
          <NFTGetAllTable contract={contractQuery.contract} />
        </>
      )}
    </Flex>
  );
};
