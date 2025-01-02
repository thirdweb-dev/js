import { getContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toTokens } from "../../../utils/units.js";
import { getCurrencyMetadata } from "../../erc20/read/getCurrencyMetadata.js";
import type { getOffer } from "../__generated__/IOffers/read/getOffer.js";
import { computeStatus, getNFTAsset } from "../utils.js";
import type { Offer } from "./types.js";

/**
 * @internal
 */
export async function mapOffer(
  options: BaseTransactionOptions<{
    latestBlock: { timestamp: bigint };
    rawOffer: Awaited<ReturnType<typeof getOffer>>;
  }>,
): Promise<Offer> {
  const { latestBlock, rawOffer } = options;
  // process the listing
  const status = computeStatus({
    listingStatus: rawOffer.status,
    blockTimeStamp: latestBlock.timestamp,
    // startTimestamp is always 0 for offers (they only have an expiration time not a start time)
    startTimestamp: 0n,
    endTimestamp: rawOffer.expirationTimestamp,
  });

  const [currencyValuePerToken, nftAsset] = await Promise.all([
    getCurrencyMetadata({
      contract: getContract({
        ...options.contract,
        address: rawOffer.currency,
      }),
    }),
    getNFTAsset({
      ...options,
      contract: getContract({
        ...options.contract,
        address: rawOffer.assetContract,
      }),
      tokenId: rawOffer.tokenId,
    }),
  ]);

  return {
    id: rawOffer.offerId,
    offerorAddress: rawOffer.offeror,
    assetContractAddress: rawOffer.assetContract,
    tokenId: rawOffer.tokenId,
    quantity: rawOffer.quantity,
    currencyContractAddress: rawOffer.currency,
    currencyValue: {
      ...currencyValuePerToken,
      value: rawOffer.totalPrice,
      displayValue: toTokens(
        rawOffer.totalPrice,
        currencyValuePerToken.decimals,
      ),
    },
    totalPrice: rawOffer.totalPrice,
    asset: nftAsset,
    endTimeInSeconds: rawOffer.expirationTimestamp,
    status,
  };
}
