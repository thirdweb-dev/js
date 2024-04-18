import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

import {
  type GetAuctionParams as GetAuctionParamsGenerated,
  getAuction as getAuctionGenerated,
} from "../../__generated__/IEnglishAuctions/read/getAuction.js";
import type { EnglishAuction } from "../types.js";
import { mapEnglishAuction } from "../utils.js";

export type GetAuctionParams = GetAuctionParamsGenerated;

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
    getAuctionGenerated(options),
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
