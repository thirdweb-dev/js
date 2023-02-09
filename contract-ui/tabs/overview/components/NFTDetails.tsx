import { Box, Flex, GridItem, Image, SimpleGrid } from "@chakra-ui/react";
import { NFTContract, useNFTs } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
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
  return (
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
      {[
        "ERC721ClaimPhasesV1",
        "ERC721ClaimPhasesV2",
        "ERC721ClaimConditionsV1",
        "ERC721ClaimConditionsV2",
        "ERC721ClaimCustom",
      ].some((type) => features.includes(type)) && (
        <SupplyCards contract={contract} />
      )}
      <NFTCards contract={contract} trackingCategory={trackingCategory} />
    </Flex>
  );
};

interface ContractOverviewNFTGetAllProps {
  contract: NFTContract;
  trackingCategory: TrackedLinkProps["category"];
}
const NFTCards: React.FC<ContractOverviewNFTGetAllProps> = ({ contract }) => {
  const getNFTQueryResult = useNFTs(contract, { count: 3 });

  return getNFTQueryResult?.data?.length === 0 ? null : (
    <SimpleGrid gap={4} columns={{ base: 1, md: 3 }}>
      {getNFTQueryResult.data?.map((token) => (
        <GridItem as={Card} key={token.owner} p={0}>
          {token.metadata.image && (
            <Box w="100%" overflow="hidden" roundedTop="xl">
              <NFTMediaWithEmptyState metadata={token.metadata} />
            </Box>
          )}
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
