import type {
  AuctionListing,
  DirectListing,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { Marketplace } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/marketplace";

type ListingMetadata = AuctionListing | DirectListing;

export type TTableType<TContract extends ValidContractInstance> =
  TContract extends Marketplace ? ListingMetadata : never;
