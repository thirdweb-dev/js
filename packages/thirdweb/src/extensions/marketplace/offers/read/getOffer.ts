import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import {
  type GetOfferParams as GetOfferParamsGenerated,
  getOffer as getOfferGenerated,
} from "../../__generated__/IOffers/read/getOffer.js";
import type { Offer } from "../types.js";
import { mapOffer } from "../utils.js";

export type GetOfferParams = GetOfferParamsGenerated;

/**
 * Retrieves an offer based on the provided options.
 * @param options - The options for retrieving the offer.
 * @returns A promise that resolves to the offer.
 * @extension MARKETPLACE
 * @example
 *
 * ```ts
 * import { getOffer } from "thirdweb/extensions/marketplace";
 *
 * const listing = await getOffer({ contract, listingId: 1n });
 * ```
 */
export async function getOffer(
  options: BaseTransactionOptions<GetOfferParams>,
): Promise<Offer> {
  const rpcClient = getRpcClient(options.contract);
  const [rawOffer, latestBlock] = await Promise.all([
    getOfferGenerated(options),
    eth_getBlockByNumber(rpcClient, {
      blockTag: "latest",
    }),
  ]);

  return mapOffer({
    contract: options.contract,
    latestBlock,
    rawOffer,
  });
}
