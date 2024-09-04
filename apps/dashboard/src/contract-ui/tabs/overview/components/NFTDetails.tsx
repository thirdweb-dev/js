import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { useTabHref } from "contract-ui/utils";
import type { ThirdwebContract } from "thirdweb";
import { getNFTs } from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";
import { Heading, TrackedLink, type TrackedLinkProps } from "tw-components";
import { NFTCards } from "./NFTCards";

interface NFTDetailsProps {
  contract: ThirdwebContract;
  trackingCategory: TrackedLinkProps["category"];
}

export const NFTDetails: React.FC<NFTDetailsProps> = ({
  contract,
  trackingCategory,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const nftsHref = useTabHref("nfts");

  const nftQuery = useReadContract(getNFTs, {
    contract,
    count: 5,
    includeOwners: true,
  });

  const displayableNFTs =
    nftQuery.data
      ?.filter((token) => token.metadata.image || token.metadata.animation_url)
      .slice(0, isMobile ? 2 : 3) || [];

  return displayableNFTs.length === 0 && !nftQuery.isLoading ? null : (
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
          View all -&gt;
        </TrackedLink>
      </Flex>
      <NFTCards
        contractAddress={contract.address}
        nfts={displayableNFTs}
        trackingCategory={trackingCategory}
        isLoading={nftQuery.isLoading}
      />
    </Flex>
  );
};
