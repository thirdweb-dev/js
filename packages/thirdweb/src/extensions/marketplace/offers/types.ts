import type { Address } from "abitype";
import type { NFT } from "../../../utils/nft/parseNft.js";
import type { GetBalanceResult } from "../../erc20/read/getBalance.js";
import type { ListingStatus } from "../types.js";

export type Offer = {
  id: bigint;
  offerorAddress: Address;
  assetContractAddress: Address;
  tokenId: bigint;
  quantity: bigint;
  currencyContractAddress: Address;
  currencyValue: GetBalanceResult;
  totalPrice: bigint;
  asset: NFT;
  endTimeInSeconds: bigint;
  status: ListingStatus;
};
