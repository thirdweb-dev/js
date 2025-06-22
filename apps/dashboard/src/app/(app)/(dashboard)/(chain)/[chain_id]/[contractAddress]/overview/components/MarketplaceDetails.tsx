"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
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
import { NFTMediaWithEmptyState } from "@/components/blocks/nft-media";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonContainer } from "@/components/ui/skeleton";
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
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
};

const DirectListingCards: React.FC<ListingCardsSectionProps> = ({
  contract,
  chainSlug,
  projectMeta,
}) => {
  const directListingsHref = buildContractPagePath({
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
    projectMeta,
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
          currencyValue: v.currencyValuePerToken,
          sellerAddress: v.creatorAddress,
          type: "direct-listing" as const,
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
          className="gap-2 bg-background text-muted-foreground"
          size="sm"
          variant="outline"
        >
          <Link href={directListingsHref}>
            View all <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="p-6">
        <ListingCards
          chainSlug={chainSlug}
          client={contract.client}
          contractAddress={contract.address}
          isPending={listingsQuery.isPending}
          listings={listings}
          projectMeta={projectMeta}
        />
      </div>
    </div>
  );
};

const EnglishAuctionCards: React.FC<ListingCardsSectionProps> = ({
  contract,
  chainSlug,
  projectMeta,
}) => {
  const englishAuctionsHref = buildContractPagePath({
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
    projectMeta,
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
          currencyValue: v.buyoutCurrencyValue,
          sellerAddress: v.creatorAddress,
          type: "english-auction",
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
          className="gap-2 bg-background text-muted-foreground"
          size="sm"
          variant="outline"
        >
          <Link href={englishAuctionsHref}>
            View all <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="p-6">
        <ListingCards
          chainSlug={chainSlug}
          client={contract.client}
          contractAddress={contract.address}
          isPending={auctionsQuery.isPending}
          listings={auctions}
          projectMeta={projectMeta}
        />
      </div>
    </div>
  );
};

interface MarketplaceDetailsVersionProps {
  contract: ThirdwebContract;
  hasEnglishAuctions: boolean;
  hasDirectListings: boolean;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}

export const MarketplaceDetails: React.FC<MarketplaceDetailsVersionProps> = ({
  contract,
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
          chainSlug={chainSlug}
          contract={contract}
          projectMeta={projectMeta}
        />
      )}

      {hasEnglishAuctions && (
        <EnglishAuctionCards
          chainSlug={chainSlug}
          contract={contract}
          projectMeta={projectMeta}
        />
      )}
    </div>
  );
};

const dummyMetadata: (idx: number) => ListingData = (idx) => ({
  asset: {
    chainId: 1,
    id: BigInt(idx),
    metadata: { id: BigInt(idx), name: `NFT #${idx}`, uri: "" },
    owner: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    supply: BigInt(1),
    tokenAddress: ZERO_ADDRESS,
    tokenURI: "",
    type: "ERC721",
  },
  creatorAddress: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  currencyValue: {
    chainId: 1,
    decimals: 18,
    displayValue: "0.0",
    name: "Ether",
    symbol: "ETH",
    tokenAddress: ZERO_ADDRESS,
    value: 0n,
  },
  currencyValuePerToken: {
    chainId: 1,
    decimals: 18,
    displayValue: "0.0",
    name: "Ether",
    symbol: "ETH",
    tokenAddress: ZERO_ADDRESS,
    value: 0n,
  },
  id: BigInt(idx),
  type: "direct-listing",
});

interface ListingCardsProps {
  listings: ListingData[];
  isPending: boolean;
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
  chainSlug,
  contractAddress,
  projectMeta,
  client,
}) => {
  const contractLayout = buildContractPagePath({
    chainIdOrSlug: chainSlug,
    contractAddress,
    projectMeta,
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
              className="block h-full w-full"
              loadedData={isPending ? undefined : listing.asset.metadata}
              render={(v) => {
                return (
                  <NFTMediaWithEmptyState
                    client={client}
                    height="100%"
                    metadata={v}
                    requireInteraction
                    width="100%"
                  />
                );
              }}
              skeletonData={listing.asset.metadata}
            />
          </div>

          <div className="flex flex-col gap-1 p-4 pb-3">
            {/* Card Link + Title */}
            <SkeletonContainer
              loadedData={isPending ? undefined : listing.asset.metadata.name}
              render={(v) => (
                <Link
                  className="before:absolute before:inset-0"
                  href={
                    listing.type === "direct-listing"
                      ? directListingsHref
                      : englishAuctionsHref
                  }
                >
                  {v}
                </Link>
              )}
              skeletonData="Listing Title"
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
                render={(v) => (
                  <p className="text-muted-foreground text-sm">{v}</p>
                )}
                skeletonData={listing.type}
              />
            )}

            {/* seller */}
            <SkeletonContainer
              className="mt-4 border-t pt-4"
              loadedData={isPending ? undefined : listing.creatorAddress}
              render={(v) => (
                <div>
                  <p className="text-muted-foreground text-xs">Seller</p>
                  <WalletAddress
                    address={v}
                    className="relative z-[1] self-start text-xs"
                    client={client}
                  />
                </div>
              )}
              skeletonData={listing.creatorAddress}
            />

            {/* price */}
            {!isPending && (
              <Badge
                className="absolute top-2 right-2 bg-background py-1.5"
                variant="outline"
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
