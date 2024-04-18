import type { Address } from "abitype";
import type { NFT } from "../../../utils/nft/parseNft.js";
import type { GetBalanceResult } from "../../erc20/read/getBalance.js";
import type { ListingStatus } from "../types.js";

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
