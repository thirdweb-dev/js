import {
  AspectRatio,
  Flex,
  GridItem,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import type { MarketplaceV3 } from "@thirdweb-dev/sdk";
import { ListingStatsV3 } from "contract-ui/tabs/listings/components/listing-stats";
import { useTabHref } from "contract-ui/utils";
import { BigNumber } from "ethers";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useMemo } from "react";
import { getContract } from "thirdweb";
import {
  type DirectListing,
  type EnglishAuction,
  getAllAuctions,
  getAllListings,
  totalAuctions,
  totalListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import {
  Badge,
  Card,
  Heading,
  Text,
  TrackedLink,
  type TrackedLinkProps,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { thirdwebClient } from "../../../../lib/thirdweb-client";

type ListingData =
  | (Pick<
      EnglishAuction,
      "asset" | "id" | "creatorAddress" | "buyoutCurrencyValue"
    > & {
      type: "english-auction";
      currencyValue: EnglishAuction["buyoutCurrencyValue"];
    })
  | (Pick<
      DirectListing,
      "asset" | "id" | "creatorAddress" | "currencyValuePerToken"
    > & {
      type: "direct-listing";
      currencyValue: DirectListing["currencyValuePerToken"];
    });

type MarketplaceDetailsProps = {
  contractAddress: string;
  contractType: "marketplace" | "marketplace-v3";
  features: string[];
  trackingCategory: TrackedLinkProps["category"];
};

interface MarketplaceDetailsVersionProps<T> {
  contract: T;
  trackingCategory: TrackedLinkProps["category"];
  features: MarketplaceDetailsProps["features"];
}

export const MarketplaceDetails: React.FC<MarketplaceDetailsProps> = ({
  contractAddress,
  contractType,
  trackingCategory,
  features,
}) => {
  const { contract } = useContract(contractAddress, contractType);

  if (contractType === "marketplace" && contract) {
    // no longer supported
    return null;
  }
  return (
    <MarketplaceV3Details
      contract={contract as MarketplaceV3}
      trackingCategory={trackingCategory}
      features={features}
    />
  );
};

type ListingCardsSectionProps = {
  contract: MarketplaceV3;
  trackingCategory: TrackedLinkProps["category"];
};

const DirectListingCards: React.FC<ListingCardsSectionProps> = ({
  trackingCategory,
  contract: v4Contract,
}) => {
  const chain = useV5DashboardChain(v4Contract.chainId);
  const contract = getContract({
    client: thirdwebClient,
    address: v4Contract.getAddress(),
    chain: chain,
  });
  const directListingsHref = useTabHref("direct-listings");
  const countQuery = useReadContract(totalListings, { contract });
  const listingsQuery = useReadContract(getAllListings, {
    contract,
    count: 3n,
    start: Math.max(BigNumber.from(countQuery?.data || 3)?.toNumber() - 3, 0),
  });
  const listings = useMemo(
    () =>
      listingsQuery?.data
        ?.map((v) => ({
          ...v,
          sellerAddress: v.creatorAddress,
          type: "direct-listing" as const,
          currencyValue: v.currencyValuePerToken,
        }))
        .reverse() || [],
    [listingsQuery?.data],
  );

  if (!countQuery.isLoading && BigNumber.from(countQuery.data || 0).eq(0)) {
    return null;
  }
  if (!listingsQuery.isLoading && listings.length === 0) {
    return null;
  }

  return (
    <>
      <Flex align="center" justify="space-between" w="full">
        <Heading size="label.lg">Direct Listings</Heading>
        <TrackedLink
          category={trackingCategory}
          label="view_all_direct_listings"
          color="blue.400"
          _light={{
            color: "blue.600",
          }}
          gap={4}
          href={directListingsHref}
        >
          View all -&gt;
        </TrackedLink>
      </Flex>
      <ListingCards
        listings={listings}
        isLoading={listingsQuery.isLoading}
        trackingCategory={trackingCategory}
      />
    </>
  );
};

const EnglishAuctionCards: React.FC<ListingCardsSectionProps> = ({
  trackingCategory,
  contract: v4Contract,
}) => {
  const chain = useV5DashboardChain(v4Contract.chainId);
  const contract = getContract({
    client: thirdwebClient,
    address: v4Contract.getAddress(),
    chain: chain,
  });

  const englishAuctionsHref = useTabHref("english-auctions");
  const countQuery = useReadContract(totalAuctions, { contract });
  const auctionsQuery = useReadContract(getAllAuctions, {
    contract,
    count: 3n,
    start: Math.max(BigNumber.from(countQuery?.data || 3)?.toNumber() - 3, 0),
  });
  const auctions = useMemo(
    () =>
      auctionsQuery?.data
        ?.map<ListingData>((v) => ({
          ...v,
          sellerAddress: v.creatorAddress,
          type: "english-auction",
          currencyValue: v.buyoutCurrencyValue,
        }))
        .reverse() || [],
    [auctionsQuery?.data],
  );

  if (!countQuery.isLoading && BigNumber.from(countQuery.data || 0).eq(0)) {
    return null;
  }
  if (!auctionsQuery.isLoading && auctions.length === 0) {
    return null;
  }

  return (
    <>
      <Flex align="center" justify="space-between" w="full">
        <Heading size="label.lg">English Auctions</Heading>
        <TrackedLink
          category={trackingCategory}
          label="view_all_english_auctions"
          color="blue.400"
          _light={{
            color: "blue.600",
          }}
          gap={4}
          href={englishAuctionsHref}
        >
          View all -&gt;
        </TrackedLink>
      </Flex>
      <ListingCards
        listings={auctions}
        isLoading={auctionsQuery.isLoading}
        trackingCategory={trackingCategory}
      />
    </>
  );
};

const MarketplaceV3Details: React.FC<
  MarketplaceDetailsVersionProps<MarketplaceV3>
> = ({ contract, trackingCategory, features }) => {
  const hasDirectListings = features.includes("DirectListings");
  const hasEnglishAuctions = features.includes("EnglishAuctions");

  return (
    <Flex gap={6} flexDirection="column">
      <Heading size="title.sm">Listings</Heading>
      <ListingStatsV3 contract={contract} features={features} />
      {hasDirectListings && contract && (
        <DirectListingCards
          contract={contract}
          trackingCategory={trackingCategory}
        />
      )}
      {hasEnglishAuctions && contract && (
        <EnglishAuctionCards
          contract={contract}
          trackingCategory={trackingCategory}
        />
      )}
    </Flex>
  );
};

const dummyMetadata: (idx: number) => ListingData = (idx) => ({
  id: BigInt(idx),
  asset: {
    id: BigInt(idx),
    metadata: { name: `NFT #${idx}`, id: BigInt(idx), uri: "" },
    owner: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    supply: BigInt(1),
    tokenURI: "",
    type: "ERC721",
  },
  currencyValuePerToken: {
    decimals: 18,
    displayValue: "0.0",
    name: "Ether",
    symbol: "ETH",
    value: 0n,
  },
  creatorAddress: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  type: "direct-listing",
  currencyValue: {
    name: "Ether",
    symbol: "ETH",
    value: 0n,
    displayValue: "0.0",
    decimals: 18,
  },
});

interface ListingCardsProps {
  listings: ListingData[];
  isLoading: boolean;
  trackingCategory: TrackedLinkProps["category"];
  isMarketplaceV1?: boolean;
}
const ListingCards: React.FC<ListingCardsProps> = ({
  listings,
  isLoading,
  isMarketplaceV1,
  trackingCategory,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  listings = isLoading
    ? Array.from({ length: isMobile ? 2 : 3 }).map((_, idx) =>
        dummyMetadata(idx),
      )
    : listings.slice(0, isMobile ? 2 : 3);

  const directListingsHref = useTabHref("direct-listings");
  const englishAuctionsHref = useTabHref("english-auctions");

  return (
    <SimpleGrid gap={{ base: 3, md: 6 }} columns={{ base: 2, md: 3 }}>
      {listings.map((listing, index) => (
        <GridItem
          key={`${listing.creatorAddress}-${index}`}
          as={TrackedLink}
          category={trackingCategory}
          href={
            listing.type === "direct-listing"
              ? directListingsHref
              : englishAuctionsHref
          }
          _hover={{ opacity: 0.75, textDecoration: "none" }}
        >
          <Card p={0} position="relative">
            <AspectRatio w="100%" ratio={1} overflow="hidden" rounded="xl">
              <Skeleton isLoaded={!isLoading}>
                <NFTMediaWithEmptyState
                  metadata={listing.asset.metadata}
                  requireInteraction
                  width="100%"
                  height="100%"
                />
              </Skeleton>
            </AspectRatio>
            <Flex p={4} pb={3} gap={1} direction="column">
              <Skeleton w={!isLoading ? "100%" : "50%"} isLoaded={!isLoading}>
                <Heading size="label.md">{listing.asset.metadata.name}</Heading>
              </Skeleton>
              {isMarketplaceV1 && (
                <SkeletonText isLoaded={!isLoading}>
                  <Text size="body.sm">
                    {listing.type === "direct-listing"
                      ? "Direct Listing"
                      : "English Auction"}
                  </Text>
                </SkeletonText>
              )}

              <Text size="body.sm" mt={4}>
                Seller
              </Text>
              <SkeletonText isLoaded={!isLoading}>
                <AddressCopyButton address={listing.creatorAddress} size="xs" />
              </SkeletonText>
              <SkeletonText
                as={Badge}
                background="backgroundHighlight"
                isLoaded={!isLoading}
                skeletonHeight={3.5}
                noOfLines={1}
                position="absolute"
                rounded="lg"
                size="body.xs"
                p={2}
                top={2}
                right={2}
              >
                <b>{listing.currencyValue.displayValue}</b>{" "}
                {listing.currencyValue.symbol}
              </SkeletonText>
            </Flex>
          </Card>
        </GridItem>
      ))}
    </SimpleGrid>
  );
};
