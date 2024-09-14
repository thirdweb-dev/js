import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import * as GetListing from "../../__generated__/IDirectListings/read/getListing.js";
import type { DirectListing } from "../types.js";
import { mapDirectListing } from "../utils.js";

/**
 * @extension MARKETPLACE
 */
export type GetListingParams = GetListing.GetListingParams;

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
    GetListing.getListing(options),
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

/**
 * Checks if the `isGetListingSupported` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isGetListingSupported` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetListingSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isGetListingSupported(["0x..."]);
 * ```
 */
export function isGetListingSupported(availableSelectors: string[]) {
  return GetListing.isGetListingSupported(availableSelectors);
}
