import { AspectRatio, Box, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useNFTs } from "@thirdweb-dev/react";
import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { SupplyCards } from "contract-ui/tabs/nfts/components/supply-cards";
import {
  Card,
  Heading,
  Text,
  TrackedLink,
  TrackedLinkProps,
} from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

interface NFTDetailsProps {
  contract: SmartContract;
  trackingCategory: TrackedLinkProps["category"];
  features: string[];
}

export const NFTDetails: React.FC<NFTDetailsProps> = ({
  contract,
  trackingCategory,
  features,
}) => {
  const nfts = useNFTs(contract);

  const showSupplyCards = [
    "ERC721ClaimPhasesV1",
    "ERC721ClaimPhasesV2",
    "ERC721ClaimConditionsV1",
    "ERC721ClaimConditionsV2",
    "ERC721ClaimCustom",
  ].some((type) => features.includes(type));

  return nfts?.data?.length === 0 && !showSupplyCards ? null : (
    <Flex direction="column" gap={6}>
      <Flex align="center" justify="space-between" w="full">
        <Heading size="title.sm">NFT Details</Heading>
        <TrackedLink
          category={trackingCategory}
          label="view_all_nfts"
          color="blue.600"
          gap={4}
          href="/nfts"
        >
          View all -&gt;
        </TrackedLink>
      </Flex>
      {showSupplyCards && <SupplyCards contract={contract} />}
      <NFTCards
        nfts={nfts?.data?.filter((token) => token.metadata).slice(0, 3) || []}
      />
    </Flex>
  );
};

interface ContractOverviewNFTGetAllProps {
  nfts: NFT[];
}
const NFTCards: React.FC<ContractOverviewNFTGetAllProps> = ({ nfts }) => {
  return nfts?.length === 0 ? null : (
    <SimpleGrid gap={6} columns={{ base: 1, md: 3 }}>
      {nfts?.map((token) => (
        <GridItem as={Card} key={token.owner} p={0}>
          <AspectRatio w="100%" ratio={1} overflow="hidden" roundedTop="xl">
            <NFTMediaWithEmptyState metadata={token.metadata} />
          </AspectRatio>
          <Box p={6} pt={4}>
            <Heading size="label.md">{token.metadata.name}</Heading>
            <Text mt={2} noOfLines={3}>
              {token.metadata.description ? (
                token.metadata.description
              ) : (
                <i>No description</i>
              )}
            </Text>
          </Box>
        </GridItem>
      ))}
    </SimpleGrid>
  );
};
