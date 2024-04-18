import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { min } from "../../../../utils/bigint.js";
import { getAllOffers as getAllOffersGenerated } from "../../__generated__/IOffers/read/getAllOffers.js";
import { totalOffers } from "../../__generated__/IOffers/read/totalOffers.js";
import { getAllInBatches } from "../../utils.js";
import type { Offer } from "../types.js";
import { mapOffer } from "../utils.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

export type GetAllOffersParams = {
  /**
   * The start index of the offers to retrieve.
   * @default 0
   */
  start?: number;
  /**
   * The number of offers to retrieve.
   * @default 100
   */
  count?: bigint;
};

/**
 * Retrieves all offers based on the provided options.
 * @param options - The options for retrieving the offers.
 * @returns A promise that resolves to the offers array.
 * @extension MARKETPLACE
 * @example
 *
 * ```ts
 * import { getAllOffers } from "thirdweb/extensions/marketplace";
 *
 * const listings = await getAllOffers({ contract, start: 0, count: 10 });
 * ```
 */
export async function getAllOffers(
  options: BaseTransactionOptions<GetAllOffersParams>,
): Promise<Offer[]> {
  const totalCount = await totalOffers(options);
  // if the totalListingCount is 0, return an empty array and skip all other work
  if (totalCount === 0n) {
    return [];
  }

  const start = BigInt(options.start || 0);
  const count = BigInt(options.count || DEFAULT_QUERY_ALL_COUNT);
  const end = min(totalCount, start + count);

  const rpcClient = getRpcClient(options.contract);
  const [rawOffers, latestBlock] = await Promise.all([
    getAllInBatches(
      (startId, endId) =>
        getAllOffersGenerated({ contract: options.contract, startId, endId }),
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

  return await Promise.all(
    rawOffers.map((rawOffer) =>
      mapOffer({
        contract: options.contract,
        latestBlock,
        rawOffer,
      }),
    ),
  );
}
