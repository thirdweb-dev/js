import { WalletAddress } from "@/components/blocks/wallet-address";
import {
  Flex,
  GridItem,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ListingStatsV3 } from "contract-ui/tabs/listings/components/listing-stats";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  type DirectListing,
  type EnglishAuction,
  getAllAuctions,
  getAllListings,
  totalAuctions,
  totalListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import { min } from "thirdweb/utils";
import { Badge, Card, Heading, Text, TrackedLink } from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

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

type ListingCardsSectionProps = {
  contract: ThirdwebContract;
  trackingCategory: string;
  chainSlug: string;
};

const DirectListingCards: React.FC<ListingCardsSectionProps> = ({
  trackingCategory,
  contract,
  chainSlug,
}) => {
  const directListingsHref = `/${chainSlug}/${contract.address}/direct-listings`;
  const countQuery = useReadContract(totalListings, { contract });
  const listingsQuery = useReadContract(getAllListings, {
    contract,
    count: 3n,
    start: Math.max(
      Number(
        min((countQuery?.data || 3n) - 3n, BigInt(Number.MAX_SAFE_INTEGER)),
      ),
      0,
    ),
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

  if (!countQuery.isPending && (countQuery.data || 0n) === 0n) {
    return null;
  }
  if (!listingsQuery.isPending && listings.length === 0) {
    return null;
  }

  return (
    <>
      <Flex align="center" justify="space-between" w="full">
        <h2 className="font-semibold text-2xl tracking-tight">
          Direct Listing
        </h2>
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
        isPending={listingsQuery.isPending}
        trackingCategory={trackingCategory}
        chainSlug={chainSlug}
        contractAddress={contract.address}
      />
    </>
  );
};

const EnglishAuctionCards: React.FC<ListingCardsSectionProps> = ({
  trackingCategory,
  contract,
  chainSlug,
}) => {
  const englishAuctionsHref = `/${chainSlug}/${contract.address}/english-auctions`;
  const countQuery = useReadContract(totalAuctions, { contract });
  const auctionsQuery = useReadContract(getAllAuctions, {
    contract,
    count: 3n,
    start: Math.max(
      Number(
        min((countQuery?.data || 3n) - 3n, BigInt(Number.MAX_SAFE_INTEGER)),
      ),
      0,
    ),
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

  if (!countQuery.isPending && (countQuery.data || 0n) === 0n) {
    return null;
  }
  if (!auctionsQuery.isPending && auctions.length === 0) {
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
        isPending={auctionsQuery.isPending}
        trackingCategory={trackingCategory}
        chainSlug={chainSlug}
        contractAddress={contract.address}
      />
    </>
  );
};

interface MarketplaceDetailsVersionProps {
  contract: ThirdwebContract;
  trackingCategory: string;
  hasEnglishAuctions: boolean;
  hasDirectListings: boolean;
  chainSlug: string;
}

export const MarketplaceDetails: React.FC<MarketplaceDetailsVersionProps> = ({
  contract,
  trackingCategory,
  hasDirectListings,
  hasEnglishAuctions,
  chainSlug,
}) => {
  return (
    <Flex gap={6} flexDirection="column">
      <Heading size="title.sm">Listings</Heading>
      <ListingStatsV3
        contract={contract}
        hasDirectListings={hasDirectListings}
        hasEnglishAuctions={hasEnglishAuctions}
      />
      {hasDirectListings && contract && (
        <DirectListingCards
          contract={contract}
          trackingCategory={trackingCategory}
          chainSlug={chainSlug}
        />
      )}
      {hasEnglishAuctions && contract && (
        <EnglishAuctionCards
          contract={contract}
          trackingCategory={trackingCategory}
          chainSlug={chainSlug}
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
  isPending: boolean;
  trackingCategory: string;
  isMarketplaceV1?: boolean;
  chainSlug: string;
  contractAddress: string;
}
const ListingCards: React.FC<ListingCardsProps> = ({
  listings,
  isPending,
  isMarketplaceV1,
  trackingCategory,
  chainSlug,
  contractAddress,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  listings = isPending
    ? Array.from({ length: isMobile ? 2 : 3 }).map((_, idx) =>
        dummyMetadata(idx),
      )
    : listings.slice(0, isMobile ? 2 : 3);

  const directListingsHref = `/${chainSlug}/${contractAddress}/direct-listings`;
  const englishAuctionsHref = `/${chainSlug}/${contractAddress}/english-auctions`;

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
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Skeleton isLoaded={!isPending}>
                <NFTMediaWithEmptyState
                  metadata={listing.asset.metadata}
                  requireInteraction
                  width="100%"
                  height="100%"
                />
              </Skeleton>
            </div>
            <Flex p={4} pb={3} gap={1} direction="column">
              <Skeleton w={!isPending ? "100%" : "50%"} isLoaded={!isPending}>
                <Heading size="label.md">{listing.asset.metadata.name}</Heading>
              </Skeleton>
              {isMarketplaceV1 && (
                <SkeletonText isLoaded={!isPending}>
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
              <SkeletonText isLoaded={!isPending}>
                <WalletAddress address={listing.creatorAddress} />
              </SkeletonText>
              <SkeletonText
                as={Badge}
                background="backgroundHighlight"
                isLoaded={!isPending}
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
