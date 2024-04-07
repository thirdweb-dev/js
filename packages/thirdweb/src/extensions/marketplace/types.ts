import type { Address } from "abitype";
import type { NFT } from "../../utils/nft/parseNft.js";
import type { GetBalanceResult } from "../erc20/read/getBalance.js";

export type ListingStatus =
  | "UNSET"
  | "CREATED"
  | "COMPLETED"
  | "CANCELLED"
  | "ACTIVE"
  | "EXPIRED";

export type DirectListing = {
  id: bigint;
  creatorAddress: Address;
  assetContractAddress: Address;
  tokenId: bigint;
  quantity: bigint;
  currencyContractAddress: Address;
  currencyValuePerToken: GetBalanceResult;
  pricePerToken: bigint;
  asset: NFT;
  startTimeInSeconds: bigint;
  endTimeInSeconds: bigint;
  isReservedListing: boolean;
  status: ListingStatus;
};

export type EnglishAuction = {
  id: bigint;
  creatorAddress: Address;
  assetContractAddress: Address;
  tokenId: bigint;
  quantity: bigint;
  currencyContractAddress: Address;
  minimumBidAmount: bigint;
  minimumBidCurrencyValue: GetBalanceResult;
  buyoutBidAmount: bigint;
  buyoutCurrencyValue: GetBalanceResult;
  timeBufferInSeconds: bigint;
  bidBufferBps: bigint;
  startTimeInSeconds: bigint;
  endTimeInSeconds: bigint;
  asset: NFT;
  status: ListingStatus;
};
