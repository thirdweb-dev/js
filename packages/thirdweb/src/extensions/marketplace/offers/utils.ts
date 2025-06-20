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
    blockTimeStamp: latestBlock.timestamp,
    endTimestamp: rawOffer.expirationTimestamp,
    listingStatus: rawOffer.status,
    // startTimestamp is always 0 for offers (they only have an expiration time not a start time)
    startTimestamp: 0n,
  });

  const currencyContract = getContract({
    ...options.contract,
    address: rawOffer.currency,
  });
  const [currencyValuePerToken, nftAsset] = await Promise.all([
    getCurrencyMetadata({
      contract: currencyContract,
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
    asset: nftAsset,
    assetContractAddress: rawOffer.assetContract,
    currencyContractAddress: rawOffer.currency,
    currencyValue: {
      ...currencyValuePerToken,
      chainId: currencyContract.chain.id,
      displayValue: toTokens(
        rawOffer.totalPrice,
        currencyValuePerToken.decimals,
      ),
      tokenAddress: currencyContract.address,
      value: rawOffer.totalPrice,
    },
    endTimeInSeconds: rawOffer.expirationTimestamp,
    id: rawOffer.offerId,
    offerorAddress: rawOffer.offeror,
    quantity: rawOffer.quantity,
    status,
    tokenId: rawOffer.tokenId,
    totalPrice: rawOffer.totalPrice,
  };
}
