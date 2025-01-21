"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
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
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { ListingStatsV3 } from "./listing-stats";

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
      <div className="flex w-full items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">
          Direct Listing
        </h2>
        <TrackedLinkTW
          category={trackingCategory}
          label="view_all_direct_listings"
          className="text-link-foreground hover:text-foreground"
          href={directListingsHref}
        >
          View all -&gt;
        </TrackedLinkTW>
      </div>
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
      <div className="flex w-full items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">
          English Auctions
        </h2>
        <TrackedLinkTW
          category={trackingCategory}
          label="view_all_english_auctions"
          className="text-link-foreground hover:text-foreground"
          href={englishAuctionsHref}
        >
          View all -&gt;
        </TrackedLinkTW>
      </div>
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
    <div className="flex flex-col gap-6">
      <h2 className="font-semibold text-2xl tracking-tight">Listings</h2>
      <ListingStatsV3
        contract={contract}
        hasDirectListings={hasDirectListings}
        hasEnglishAuctions={hasEnglishAuctions}
      />

      {hasDirectListings && (
        <DirectListingCards
          contract={contract}
          trackingCategory={trackingCategory}
          chainSlug={chainSlug}
        />
      )}

      {hasEnglishAuctions && (
        <EnglishAuctionCards
          contract={contract}
          trackingCategory={trackingCategory}
          chainSlug={chainSlug}
        />
      )}
    </div>
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
  listings = isPending
    ? Array.from({ length: 3 }).map((_, idx) => dummyMetadata(idx))
    : listings.slice(0, 3);

  const directListingsHref = `/${chainSlug}/${contractAddress}/direct-listings`;
  const englishAuctionsHref = `/${chainSlug}/${contractAddress}/english-auctions`;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 max-sm:[&>*:nth-child(n+3)]:hidden">
      {listings.map((listing, index) => (
        <div
          className="relative rounded-lg border border-border bg-card transition-colors hover:border-active-border"
          key={`${listing.creatorAddress}-${index}`}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {/* Image */}
            <SkeletonContainer
              loadedData={isPending ? undefined : listing.asset.metadata}
              skeletonData={listing.asset.metadata}
              className="block h-full w-full"
              render={(v) => {
                return (
                  <NFTMediaWithEmptyState
                    metadata={v}
                    requireInteraction
                    width="100%"
                    height="100%"
                  />
                );
              }}
            />
          </div>

          <div className="flex flex-col gap-1 p-4 pb-3">
            {/* Card Link + Title */}
            <SkeletonContainer
              loadedData={isPending ? undefined : listing.asset.metadata.name}
              skeletonData="Listing Title"
              render={(v) => (
                <TrackedLinkTW
                  category={trackingCategory}
                  className="before:absolute before:inset-0"
                  href={
                    listing.type === "direct-listing"
                      ? directListingsHref
                      : englishAuctionsHref
                  }
                >
                  {v}
                </TrackedLinkTW>
              )}
            />

            {isMarketplaceV1 && (
              <SkeletonContainer
                className="self-start"
                loadedData={
                  isPending
                    ? undefined
                    : listing.type === "direct-listing"
                      ? "Direct Listing"
                      : "English Auction"
                }
                skeletonData={listing.type}
                render={(v) => (
                  <p className="text-muted-foreground text-sm">{v}</p>
                )}
              />
            )}

            <SkeletonContainer
              loadedData={isPending ? undefined : listing.creatorAddress}
              skeletonData={listing.creatorAddress}
              className="mt-4"
              render={(v) => (
                <div>
                  <p className="text-muted-foreground text-sm">Seller</p>
                  <WalletAddress
                    className="relative z-[1] self-start"
                    address={v}
                  />
                </div>
              )}
            />

            {!isPending && (
              <Badge
                variant="outline"
                className="absolute top-2 right-2 bg-background py-1.5"
              >
                <p className="line-clamp-1">
                  <b>{listing.currencyValue.displayValue}</b>{" "}
                  {listing.currencyValue.symbol}
                </p>
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
