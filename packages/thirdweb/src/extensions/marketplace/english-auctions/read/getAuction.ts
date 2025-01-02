import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import * as GetAuction from "../../__generated__/IEnglishAuctions/read/getAuction.js";
import type { EnglishAuction } from "../types.js";
import { mapEnglishAuction } from "../utils.js";

/**
 * @extension MARKETPLACE
 */
export type GetAuctionParams = GetAuction.GetAuctionParams;

/**
 * Retrieves an auction listing based on the provided options.
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
export async function getAuction(
  options: BaseTransactionOptions<GetAuctionParams>,
): Promise<EnglishAuction> {
  const rpcClient = getRpcClient(options.contract);
  const [rawAuction, latestBlock] = await Promise.all([
    GetAuction.getAuction(options),
    eth_getBlockByNumber(rpcClient, {
      blockTag: "latest",
    }),
  ]);

  return mapEnglishAuction({
    contract: options.contract,
    latestBlock,
    rawAuction,
  });
}

/**
 * Checks if the `getAuction` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAuction` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetAuctionSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isGetAuctionSupported(["0x..."]);
 * ```
 */
export function isGetAuctionSupported(availableSelectors: string[]) {
  return GetAuction.isGetAuctionSupported(availableSelectors);
}
