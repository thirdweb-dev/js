import { EditionMetadataWithOwner } from "@3rdweb-sdk/react";
import type {
  AuctionListing,
  DirectListing,
  Edition,
  EditionDrop,
  EditionMetadata,
  Marketplace,
  NFTCollection,
  NFTDrop,
  NFTMetadataOwner,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";

type ListingMetadata = AuctionListing | DirectListing;

export type TTableType<TContract extends ValidContractInstance> =
  TContract extends NFTCollection
    ? NFTMetadataOwner
    : TContract extends Edition
    ? EditionMetadataWithOwner
    : TContract extends NFTDrop
    ? NFTMetadataOwner
    : TContract extends EditionDrop
    ? EditionMetadata
    : TContract extends Marketplace
    ? ListingMetadata
    : never;
