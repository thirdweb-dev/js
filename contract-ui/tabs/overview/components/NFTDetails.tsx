import {
  AspectRatio,
  Flex,
  GridItem,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNFTs } from "@thirdweb-dev/react";
import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { SupplyCards } from "contract-ui/tabs/nfts/components/supply-cards";
import { useTabHref } from "contract-ui/utils";
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const nftsHref = useTabHref("nfts");

  const nftQuery = useNFTs(contract, { count: 5 });

  const displayableNFTs =
    nftQuery.data
      ?.filter((token) => token.metadata.image || token.metadata.animation_url)
      .slice(0, isMobile ? 2 : 3) || [];

  const showSupplyCards = [
    "ERC721ClaimPhasesV1",
    "ERC721ClaimPhasesV2",
    "ERC721ClaimConditionsV1",
    "ERC721ClaimConditionsV2",
    "ERC721ClaimCustom",
  ].some((type) => features.includes(type));

  return displayableNFTs.length === 0 &&
    !showSupplyCards &&
    !nftQuery.isInitialLoading ? null : (
    <Flex direction="column" gap={{ base: 3, md: 6 }}>
      <Flex align="center" justify="space-between" w="full">
        <Heading size="title.sm">NFT Details</Heading>
        <TrackedLink
          category={trackingCategory}
          label="view_all_nfts"
          color="blue.400"
          _light={{
            color: "blue.600",
          }}
          gap={4}
          href={nftsHref}
        >
          View All -&gt;
        </TrackedLink>
      </Flex>
      {showSupplyCards && <SupplyCards contract={contract} />}
      <NFTCards
        nfts={displayableNFTs}
        trackingCategory={trackingCategory}
        isLoading={nftQuery.isLoading}
      />
    </Flex>
  );
};

const dummyMetadata: (idx: number) => NFT = (idx) => ({
  metadata: {
    name: "Loading...",
    description: "lorem ipsum loading sit amet",
    id: `${idx}`,
    uri: "",
  },
  owner: `0x_fake_${idx}`,
  type: "ERC721",
  supply: 1,
});

interface ContractOverviewNFTGetAllProps {
  nfts: NFT[];
  trackingCategory: TrackedLinkProps["category"];
  isLoading: boolean;
}
const NFTCards: React.FC<ContractOverviewNFTGetAllProps> = ({
  nfts,
  trackingCategory,
  isLoading,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const nftsHref = useTabHref("nfts");

  nfts = isLoading
    ? Array.from({ length: isMobile ? 2 : 3 }).map((_, idx) =>
        dummyMetadata(idx),
      )
    : nfts;
  return (
    <SimpleGrid gap={{ base: 3, md: 6 }} columns={{ base: 2, md: 3 }}>
      {nfts.map((token) => (
        <GridItem
          key={token.owner}
          as={TrackedLink}
          category={trackingCategory}
          href={nftsHref}
          _hover={{ opacity: 0.75, textDecoration: "none" }}
        >
          <Card p={0}>
            <AspectRatio w="100%" ratio={1} overflow="hidden" rounded="xl">
              <Skeleton isLoaded={!isLoading}>
                <NFTMediaWithEmptyState
                  metadata={token.metadata}
                  requireInteraction
                  width="100%"
                  height="100%"
                />
              </Skeleton>
            </AspectRatio>
            <Flex p={4} pb={3} gap={3} direction="column">
              <Skeleton w={!isLoading ? "100%" : "50%"} isLoaded={!isLoading}>
                <Heading size="label.md">{token.metadata.name}</Heading>
              </Skeleton>
              <SkeletonText isLoaded={!isLoading}>
                <Text noOfLines={3}>
                  {token.metadata.description ? (
                    token.metadata.description
                  ) : (
                    <i>No description</i>
                  )}
                </Text>
              </SkeletonText>
            </Flex>
          </Card>
        </GridItem>
      ))}
    </SimpleGrid>
  );
};
