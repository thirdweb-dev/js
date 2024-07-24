import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import {
  AspectRatio,
  Flex,
  GridItem,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useChainSlug } from "hooks/chains/chainSlug";
import type { WalletNFT } from "lib/wallet/nfts/types";
import { useMemo } from "react";
import type { NFT } from "thirdweb";
import {
  Card,
  Heading,
  Text,
  TrackedLink,
  type TrackedLinkProps,
} from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

const dummyMetadata: (idx: number) => NFT = (idx) => ({
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

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}

interface NFTCardsProps {
  nfts: NFT[] | WalletNFT[];
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

  const chainSlug = useChainSlug(chainId || 1);

  return (
    <SimpleGrid
      gap={{ base: 3, md: 6 }}
      columns={allNfts ? { base: 2, md: 4 } : { base: 2, md: 3 }}
    >
      {(isLoading ? dummyData : nfts).map((token) => {
        const tokenId = (token as WalletNFT)?.tokenId || (token as NFT).id;
        const ctrAddress =
          (token as WalletNFT)?.contractAddress || contractAddress;

        if (
          (!tokenId && tokenId !== 0n) ||
          !isOnlyNumbers(tokenId.toString())
        ) {
          return null;
        }

        return (
          <GridItem
            key={`${chainId}-${ctrAddress}-${tokenId}`}
            as={TrackedLink}
            category={trackingCategory}
            href={`/${chainSlug}/${ctrAddress}/nfts/${tokenId.toString()}`}
            _hover={{ opacity: 0.75, textDecoration: "none" }}
          >
            <Card p={0} h="full">
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
        );
      })}
    </SimpleGrid>
  );
};
