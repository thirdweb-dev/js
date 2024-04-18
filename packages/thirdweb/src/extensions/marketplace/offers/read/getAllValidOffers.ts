import { eth_getBlockByNumber } from "../../../../rpc/actions/eth_getBlockByNumber.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { min } from "../../../../utils/bigint.js";
import { getAllValidOffers as getAllValidOffersGenerated } from "../../__generated__/IOffers/read/getAllValidOffers.js";
import { totalOffers } from "../../__generated__/IOffers/read/totalOffers.js";
import { getAllInBatches } from "../../utils.js";
import type { Offer } from "../types.js";
import { mapOffer } from "../utils.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

export type GetAllValidOffersParams = {
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
 * Retrieves all valid offers based on the provided options.
 * @param options - The options for retrieving the valid offers.
 * @returns A promise that resolves to the offers array.
 * @extension MARKETPLACE
 * @example
 *
 * ```ts
 * import { getAllValidOffers } from "thirdweb/extensions/marketplace";
 *
 * const validOffers = await getAllValidOffers({ contract, start: 0, count: 10 });
 * ```
 */
export async function getAllValidOffers(
  options: BaseTransactionOptions<GetAllValidOffersParams>,
): Promise<Offer[]> {
  const totalCount = await totalOffers(options);
  // if the totalOffers count is 0, return an empty array and skip all other work
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
        getAllValidOffersGenerated({
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
