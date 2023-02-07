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
      <Heading size="title.sm">NFT Details</Heading>
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
export const NFTCards: React.FC<ContractOverviewNFTGetAllProps> = ({
  contract,
  trackingCategory,
}) => {
  const getNFTQueryResult = useNFTs(contract, { count: 3 });

  return getNFTQueryResult?.data?.length === 0 ? null : (
    <>
      <Flex align="center" justify="end" w="full">
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
      <SimpleGrid gap={4} columns={{ base: 1, md: 3 }}>
        {getNFTQueryResult.data?.map((token) => (
          <GridItem as={Card} key={token.owner} p={0}>
            {token.metadata.image && (
              <Box
                w="100%"
                pt="100%"
                position="relative"
                overflow="hidden"
                roundedTop="xl"
              >
                <Image
                  w="100%"
                  src={token.metadata.image}
                  alt=""
                  inset={0}
                  position="absolute"
                />
              </Box>
            )}
            <Box p={6} pt={4}>
              <Heading size="label.md">{token.metadata.name}</Heading>
              <Text mt={1}>
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
    </>
  );
};
