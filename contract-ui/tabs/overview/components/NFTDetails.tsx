import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { useNFTs } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { SupplyCards } from "contract-ui/tabs/nfts/components/supply-cards";
import { useTabHref } from "contract-ui/utils";
import { Heading, TrackedLink, TrackedLinkProps } from "tw-components";
import { NFTCards } from "./NFTCards";

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
          View all -&gt;
        </TrackedLink>
      </Flex>
      {showSupplyCards && <SupplyCards contract={contract} />}
      <NFTCards
        contractAddress={contract.getAddress()}
        nfts={displayableNFTs}
        trackingCategory={trackingCategory}
        isLoading={nftQuery.isLoading}
      />
    </Flex>
  );
};
