import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { useTabHref } from "contract-ui/utils";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721 from "thirdweb/extensions/erc721";
import * as ERC1155 from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { Heading, TrackedLink, type TrackedLinkProps } from "tw-components";
import { NFTCards } from "./NFTCards";

interface NFTDetailsProps {
  contract: ThirdwebContract;
  trackingCategory: TrackedLinkProps["category"];
  isErc721: boolean;
}

export const NFTDetails: React.FC<NFTDetailsProps> = ({
  contract,
  trackingCategory,
  isErc721,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const nftsHref = useTabHref("nfts");

  const nftQuery = useReadContract(
    isErc721 ? ERC721.getNFTs : ERC1155.getNFTs,
    {
      contract,
      count: 5,
      includeOwners: false,
    },
  );

  const displayableNFTs =
    nftQuery.data
      ?.filter((token) => token.metadata.image || token.metadata.animation_url)
      .slice(0, isMobile ? 2 : 3) || [];

  return displayableNFTs.length === 0 && !nftQuery.isPending ? null : (
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
        nfts={displayableNFTs.map((t) => ({
          ...t,
          contractAddress: contract.address,
          chainId: contract.chain.id,
        }))}
        trackingCategory={trackingCategory}
        isPending={nftQuery.isPending}
      />
    </Flex>
  );
};
