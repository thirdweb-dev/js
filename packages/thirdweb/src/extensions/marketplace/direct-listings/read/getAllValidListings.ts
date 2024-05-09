import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { min } from "../../../../utils/bigint.js";
import { getAllValidListings as getAllValidListingGenerated } from "../../__generated__/IDirectListings/read/getAllValidListings.js";
import { totalListings } from "../../__generated__/IDirectListings/read/totalListings.js";
import { getAllInBatches } from "../../utils.js";
import type { DirectListing } from "../types.js";
import { mapDirectListing } from "../utils.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

export type GetAllValidListingParams = {
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
 * Retrieves all valid direct listings based on the provided options.
 * @param options - The options for retrieving the valid listing.
 * @returns A promise that resolves to the direct listings array.
 * @extension MARKETPLACE
 * @example
 *
 * ```ts
 * import { getAllValidListings } from "thirdweb/extensions/marketplace";
 *
 * const validListings = await getAllValidListings({ contract, start: 0, count: 10 });
 * ```
 */
export async function getAllValidListings(
  options: BaseTransactionOptions<GetAllValidListingParams>,
): Promise<DirectListing[]> {
  const totalCount = await totalListings(options);
  // if the totalListingCount is 0, return an empty array and skip all other work
  if (totalCount === 0n) {
    return [];
  }

  const start = BigInt(options.start || 0);
  const count = BigInt(options.count || DEFAULT_QUERY_ALL_COUNT);
  const end = min(totalCount, start + count);

  const rpcClient = getRpcClient(options.contract);
  const [rawListings, latestBlock] = await Promise.all([
    getAllInBatches(
      (startId, endId) =>
        getAllValidListingGenerated({
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

  const listings = (
    await Promise.all(
      rawListings.map((rawListing) =>
        mapDirectListing({
          contract: options.contract,
          latestBlock,
          rawListing,
        }).catch(() => null),
      ),
    )
  ).filter((listing) => listing !== null);

  return listings as DirectListing[]; // TODO: Fix when TS 5.5 is out
}
