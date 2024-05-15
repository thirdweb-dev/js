import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { min } from "../../../../utils/bigint.js";
import { getAllAuctions as getAllAuctionsGenerated } from "../../__generated__/IEnglishAuctions/read/getAllAuctions.js";
import { totalAuctions } from "../../__generated__/IEnglishAuctions/read/totalAuctions.js";
import { getAllInBatches } from "../../utils.js";
import type { EnglishAuction } from "../types.js";
import { mapEnglishAuction } from "../utils.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

export type GetAllAuctionParams = {
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
 * Retrieves all auctions based on the provided options.
 * @param options - The options for retrieving the auctions.
 * @returns A promise that resolves to the auctions array.
 * @extension MARKETPLACE
 * @example
 *
 * ```ts
 * import { getAllAuctions } from "thirdweb/extensions/marketplace";
 *
 * const listings = await getAllAuctions({ contract, start: 0, count: 10 });
 * ```
 */
export async function getAllAuctions(
  options: BaseTransactionOptions<GetAllAuctionParams>,
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
        getAllAuctionsGenerated({ contract: options.contract, startId, endId }),
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
        }).catch(() => null),
      ),
    )
  ).filter((auction) => auction !== null);

  return auctions as EnglishAuction[]; // TODO: Fix when TS 5.5 is out
}
