import type {
  AuctionListing,
  DirectListing,
  Marketplace,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";

type ListingMetadata = AuctionListing | DirectListing;

export type TTableType<TContract extends ValidContractInstance> =
  TContract extends Marketplace ? ListingMetadata : never;
