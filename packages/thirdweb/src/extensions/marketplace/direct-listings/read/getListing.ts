import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

import {
  type GetListingParams as GetListingParamsGenerated,
  getListing as getListingGenerated,
} from "../../__generated__/IDirectListings/read/getListing.js";
import type { DirectListing } from "../types.js";
import { mapDirectListing } from "../utils.js";

export type GetListingParams = GetListingParamsGenerated;

/**
 * Retrieves a direct listing based on the provided options.
 * @param options - The options for retrieving the listing.
 * @returns A promise that resolves to the direct listing.
 * @extension MARKETPLACE
 * @example
 *
 * ```ts
 * import { getListing } from "thirdweb/extensions/marketplace";
 *
 * const listing = await getListing({ contract, listingId: 1n });
 * ```
 */
export async function getListing(
  options: BaseTransactionOptions<GetListingParams>,
): Promise<DirectListing> {
  const rpcClient = getRpcClient(options.contract);
  const [rawListing, latestBlock] = await Promise.all([
    getListingGenerated(options),
    eth_getBlockByNumber(rpcClient, {
      blockTag: "latest",
    }),
  ]);

  return mapDirectListing({
    contract: options.contract,
    latestBlock,
    rawListing,
  });
}
