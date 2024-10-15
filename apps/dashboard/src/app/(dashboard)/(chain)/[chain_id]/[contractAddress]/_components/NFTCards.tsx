import {
  Flex,
  GridItem,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { type NFT, ZERO_ADDRESS } from "thirdweb";
import { Card, TrackedLink, type TrackedLinkProps } from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

type NFTWithContract = NFT & { contractAddress: string; chainId: number };

const dummyMetadata: (idx: number) => NFTWithContract = (idx) => ({
  chainId: 1,
  contractAddress: ZERO_ADDRESS,
  id: BigInt(idx || 0),
  tokenURI: `1-0x123-${idx}`,
  metadata: {
    name: "Loading...",
    description: "lorem ipsum loading sit amet",
    id: BigInt(idx || 0),
    uri: `1-0x123-${idx}`,
  },
  owner: `0x_fake_${idx}`,
  type: "ERC721",
  supply: 1n,
});

interface NFTCardsProps {
  nfts: Array<NFTWithContract>;
  trackingCategory: TrackedLinkProps["category"];
  isPending: boolean;
  allNfts?: boolean;
}

export const NFTCards: React.FC<NFTCardsProps> = ({
  nfts,
  trackingCategory,
  isPending,
  allNfts,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

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
      {(isPending ? dummyData : nfts).map((token) => {
        const tokenId = token.id.toString();

        return (
          <GridItem
            key={`${token.chainId}_${token.contractAddress}_${tokenId}`}
            as={TrackedLink}
            category={trackingCategory}
            href={`/${token.chainId}/${token.contractAddress}/nfts/${tokenId}`}
            _hover={{ opacity: 0.75, textDecoration: "none" }}
          >
            <Card p={0} h="full">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <Skeleton isLoaded={!isPending}>
                  <NFTMediaWithEmptyState
                    metadata={token.metadata}
                    requireInteraction
                    width="100%"
                    height="100%"
                  />
                </Skeleton>
              </div>
              <Flex p={4} pb={3} gap={1} direction="column">
                <Skeleton w={!isPending ? "100%" : "50%"} isLoaded={!isPending}>
                  <h2 className="font-semibold tracking-tight">
                    {token.metadata.name}
                  </h2>
                </Skeleton>
                <SkeletonText isLoaded={!isPending}>
                  <p className="line-clamp-3 text-muted-foreground text-sm">
                    {token.metadata.description ? (
                      token.metadata.description
                    ) : (
                      <i>No description</i>
                    )}
                  </p>
                </SkeletonText>
              </Flex>
            </Card>
          </GridItem>
        );
      })}
    </SimpleGrid>
  );
};
