import type { Address } from "abitype";
import type { NFT } from "../../../utils/nft/parseNft.js";
import type { GetBalanceResult } from "../../erc20/read/getBalance.js";
import type { ListingStatus } from "../types.js";

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
