"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";
import {
  type ThirdwebClient,
  type ThirdwebContract,
  ZERO_ADDRESS,
} from "thirdweb";
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
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";
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
  projectMeta: ProjectMeta | undefined;
};

const DirectListingCards: React.FC<ListingCardsSectionProps> = ({
  trackingCategory,
  contract,
  chainSlug,
  projectMeta,
}) => {
  const directListingsHref = buildContractPagePath({
    projectMeta,
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
    subpath: "/direct-listings",
  });

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
    <div className="rounded-lg border bg-card">
      <div className="flex w-full items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold text-xl tracking-tight">
          Direct Listings
        </h2>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 bg-background text-muted-foreground"
        >
          <TrackedLinkTW
            category={trackingCategory}
            label="view_all_direct_listings"
            href={directListingsHref}
          >
            View all <ArrowRightIcon className="size-4" />
          </TrackedLinkTW>
        </Button>
      </div>

      <div className="p-6">
        <ListingCards
          listings={listings}
          isPending={listingsQuery.isPending}
          trackingCategory={trackingCategory}
          chainSlug={chainSlug}
          contractAddress={contract.address}
          projectMeta={projectMeta}
          client={contract.client}
        />
      </div>
    </div>
  );
};

const EnglishAuctionCards: React.FC<ListingCardsSectionProps> = ({
  trackingCategory,
  contract,
  chainSlug,
  projectMeta,
}) => {
  const englishAuctionsHref = buildContractPagePath({
    projectMeta,
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
    subpath: "/english-auctions",
  });

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
    <div className="rounded-lg border bg-card">
      <div className="flex w-full items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold text-xl tracking-tight">
          English Auctions
        </h2>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 bg-background text-muted-foreground"
        >
          <TrackedLinkTW
            category={trackingCategory}
            label="view_all_english_auctions"
            href={englishAuctionsHref}
          >
            View all <ArrowRightIcon className="size-4" />
          </TrackedLinkTW>
        </Button>
      </div>
      <div className="p-6">
        <ListingCards
          client={contract.client}
          listings={auctions}
          isPending={auctionsQuery.isPending}
          trackingCategory={trackingCategory}
          chainSlug={chainSlug}
          contractAddress={contract.address}
          projectMeta={projectMeta}
        />
      </div>
    </div>
  );
};

interface MarketplaceDetailsVersionProps {
  contract: ThirdwebContract;
  trackingCategory: string;
  hasEnglishAuctions: boolean;
  hasDirectListings: boolean;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}

export const MarketplaceDetails: React.FC<MarketplaceDetailsVersionProps> = ({
  contract,
  trackingCategory,
  hasDirectListings,
  hasEnglishAuctions,
  chainSlug,
  projectMeta,
}) => {
  return (
    <div className="flex flex-col gap-10">
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
          projectMeta={projectMeta}
        />
      )}

      {hasEnglishAuctions && (
        <EnglishAuctionCards
          contract={contract}
          trackingCategory={trackingCategory}
          chainSlug={chainSlug}
          projectMeta={projectMeta}
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
    tokenAddress: ZERO_ADDRESS,
    chainId: 1,
  },
  currencyValuePerToken: {
    decimals: 18,
    displayValue: "0.0",
    name: "Ether",
    symbol: "ETH",
    value: 0n,
    tokenAddress: ZERO_ADDRESS,
    chainId: 1,
  },
  creatorAddress: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  type: "direct-listing",
  currencyValue: {
    name: "Ether",
    symbol: "ETH",
    value: 0n,
    displayValue: "0.0",
    decimals: 18,
    tokenAddress: ZERO_ADDRESS,
    chainId: 1,
  },
});

interface ListingCardsProps {
  listings: ListingData[];
  isPending: boolean;
  trackingCategory: string;
  isMarketplaceV1?: boolean;
  chainSlug: string;
  contractAddress: string;
  projectMeta: ProjectMeta | undefined;
  client: ThirdwebClient;
}
const ListingCards: React.FC<ListingCardsProps> = ({
  listings,
  isPending,
  isMarketplaceV1,
  trackingCategory,
  chainSlug,
  contractAddress,
  projectMeta,
  client,
}) => {
  const contractLayout = buildContractPagePath({
    projectMeta,
    chainIdOrSlug: chainSlug,
    contractAddress,
  });

  listings = isPending
    ? Array.from({ length: 3 }).map((_, idx) => dummyMetadata(idx))
    : listings.slice(0, 3);

  const directListingsHref = `${contractLayout}/direct-listings`;
  const englishAuctionsHref = `${contractLayout}/english-auctions`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
      {listings.map((listing, index) => (
        <div
          className="group hover:-translate-y-0.5 relative flex h-full cursor-pointer flex-col rounded-lg bg-background duration-200 hover:scale-[1.01]"
          key={`${listing.creatorAddress}-${index}`}
        >
          {/* border */}
          <div className="absolute inset-0 rounded-lg border border-border" />

          {/* image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {/* Image */}
            <SkeletonContainer
              loadedData={isPending ? undefined : listing.asset.metadata}
              skeletonData={listing.asset.metadata}
              className="block h-full w-full"
              render={(v) => {
                return (
                  <NFTMediaWithEmptyState
                    client={client}
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

            {/* seller */}
            <SkeletonContainer
              loadedData={isPending ? undefined : listing.creatorAddress}
              skeletonData={listing.creatorAddress}
              className="mt-4 border-t pt-4"
              render={(v) => (
                <div>
                  <p className="text-muted-foreground text-xs">Seller</p>
                  <WalletAddress
                    className="relative z-[1] self-start text-xs"
                    address={v}
                    client={client}
                  />
                </div>
              )}
            />

            {/* price */}
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
