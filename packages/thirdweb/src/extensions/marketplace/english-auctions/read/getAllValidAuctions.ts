import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { min } from "../../../../utils/bigint.js";
import { getAllValidAuctions as getAllValidAuctionsGenerated } from "../../__generated__/IEnglishAuctions/read/getAllValidAuctions.js";
import { totalAuctions } from "../../__generated__/IEnglishAuctions/read/totalAuctions.js";
import { getAllInBatches } from "../../utils.js";
import type { EnglishAuction } from "../types.js";
import { mapEnglishAuction } from "../utils.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

export type GetAllValidAuctionParams = {
  /**
   * The start index of the listings to retrieve.
   * @default 0
   */
  start?: number;
  /**
   * The number of listings to retrieve.
   * @default 100
   */
  count?: bigint;
};

/**
 * Retrieves all valid auctions based on the provided options.
 * @param options - The options for retrieving the listing.
 * @returns A promise that resolves to the valid auctions array.
 * @extension MARKETPLACE
 * @example
 *
 * ```ts
 * import { getAllValidAuctions } from "thirdweb/extensions/marketplace";
 *
 * const validAuctions = await getAllValidAuctions({ contract, start: 0, count: 10 });
 * ```
 */
export async function getAllValidAuctions(
  options: BaseTransactionOptions<GetAllValidAuctionParams>,
): Promise<EnglishAuction[]> {
  const totalCount = await totalAuctions(options);
  // if the totalListingCount is 0, return an empty array and skip all other work
  if (totalCount === 0n) {
    return [];
  }

  const start = BigInt(options.start || 0);
  const count = BigInt(options.count || DEFAULT_QUERY_ALL_COUNT);
  const end = min(totalCount, start + count);

  const rpcClient = getRpcClient(options.contract);
  const [rawAuctions, latestBlock] = await Promise.all([
    getAllInBatches(
      (startId, endId) =>
        getAllValidAuctionsGenerated({
          contract: options.contract,
          startId,
          endId,
        }),
      {
        start,
        end,
        maxSize: DEFAULT_QUERY_ALL_COUNT,
      },
      // flatten the array of arrays
    ).then((listings) => listings.flat()),
    // get the latest block number once
    eth_getBlockByNumber(rpcClient, {
      blockTag: "latest",
    }),
  ]);

  const auctions = (
    await Promise.all(
      rawAuctions.map((rawAuction) =>
        mapEnglishAuction({
          contract: options.contract,
          latestBlock,
          rawAuction,
        }),
      ),
    )
  ).filter((auction) => auction !== null);

  return auctions as EnglishAuction[]; // TODO: Fix when TS 5.5 is out
}
