import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { SupplyCards } from "contract-ui/tabs/nfts/components/supply-cards";
import { useTabHref } from "contract-ui/utils";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useMemo } from "react";
import { getContract } from "thirdweb";
import { getNFTs } from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";
import { Heading, TrackedLink, type TrackedLinkProps } from "tw-components";
import { NFTCards } from "./NFTCards";

interface NFTDetailsProps {
  contractAddress: string;
  chainId: number;
  trackingCategory: TrackedLinkProps["category"];
  features: string[];
}

export const NFTDetails: React.FC<NFTDetailsProps> = ({
  contractAddress,
  chainId,
  trackingCategory,
  features,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const nftsHref = useTabHref("nfts");
  const chain = useV5DashboardChain(chainId);

  const contract = useMemo(
    () =>
      getContract({
        client: thirdwebClient,
        address: contractAddress,
        chain,
      }),
    [contractAddress, chain],
  );

  const nftQuery = useReadContract(getNFTs, {
    contract,
    count: 5,
    includeOwners: true,
  });

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
    !nftQuery.isLoading ? null : (
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
      {showSupplyCards && contract && <SupplyCards contract={contract} />}
      <NFTCards
        contractAddress={contractAddress}
        nfts={displayableNFTs}
        trackingCategory={trackingCategory}
        isLoading={nftQuery.isLoading}
      />
    </Flex>
  );
};
