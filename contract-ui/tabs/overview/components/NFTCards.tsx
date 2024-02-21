import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import {
  useBreakpointValue,
  SimpleGrid,
  GridItem,
  AspectRatio,
  Skeleton,
  Flex,
  SkeletonText,
} from "@chakra-ui/react";
import { NFT } from "thirdweb";
import { WalletNFT } from "lib/wallet/nfts/types";
import { useMemo } from "react";
import {
  TrackedLinkProps,
  TrackedLink,
  Heading,
  Card,
  Text,
} from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

const dummyMetadata: (idx: number) => NFT = (idx) => ({
  id: BigInt(idx),
  tokenURI: `1-0x123-${idx}`,
  metadata: {
    name: "Loading...",
    description: "lorem ipsum loading sit amet",
    id: BigInt(idx),
    uri: `1-0x123-${idx}`,
  },
  owner: `0x_fake_${idx}`,
  type: "ERC721",
  supply: 1n,
});

interface NFTCardsProps {
  nfts: NFT<"ERC721">[] | WalletNFT[];
  trackingCategory: TrackedLinkProps["category"];
  isLoading: boolean;
  contractAddress?: string;
  allNfts?: boolean;
}

export const NFTCards: React.FC<NFTCardsProps> = ({
  nfts,
  contractAddress,
  trackingCategory,
  isLoading,
  allNfts,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chainId = useDashboardEVMChainId();

  const dummyData = useMemo(() => {
    return Array.from({
      length: allNfts ? nfts.length : isMobile ? 2 : 3,
    }).map((_, idx) => dummyMetadata(idx));
  }, [nfts.length, isMobile, allNfts]);

  return (
    <SimpleGrid
      gap={{ base: 3, md: 6 }}
      columns={allNfts ? { base: 2, md: 4 } : { base: 2, md: 3 }}
    >
      {(isLoading ? dummyData : nfts).map((token) => (
        <GridItem
          key={`${chainId}-${
            (token as WalletNFT)?.contractAddress || contractAddress
          }-${(token as WalletNFT).tokenId || token.metadata.id}}`}
          as={TrackedLink}
          category={trackingCategory}
          href={`/${chainId}/${
            (token as WalletNFT)?.contractAddress || contractAddress
          }/nfts/${(token as WalletNFT).tokenId || token.metadata.id}`}
          _hover={{ opacity: 0.75, textDecoration: "none" }}
        >
          <Card p={0} h="full">
            <AspectRatio w="100%" ratio={1} overflow="hidden" rounded="xl">
              <Skeleton isLoaded={!isLoading}>
                <NFTMediaWithEmptyState
                  // @ts-expect-error types are not up to date
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
