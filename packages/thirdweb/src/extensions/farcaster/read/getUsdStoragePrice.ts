import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { toBigInt } from "../../../utils/bigint.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { toTokens } from "../../../utils/units.js";
import { usdUnitPrice } from "../__generated__/IStorageRegistry/read/usdUnitPrice.js";
import { getStorageRegistry } from "../contracts/getStorageRegistry.js";

export type GetUsdStoragePriceParams = {
  client: ThirdwebClient;
  chain?: Chain;
  units?: bigint | number | string;
  disableCache?: boolean;
};

/**
 * Retrieves the current cost to register a Farcaster fid in USD.
 * @param options - An object containing a client to use to fetch the price and the amount of extra storage to include in the returned price.
 * @returns A promise that resolves to the current cost of a Farcaster fid in USD.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getUsdStoragePrice } from "thirdweb/extensions/farcaster";
 *
 * const price = await getUsdStoragePrice({
 *  client,
 * });
 * ```
 */
export async function getUsdStoragePrice(
  options: GetUsdStoragePriceParams,
): Promise<number> {
  const units = toBigInt(options.units ?? 1);
  if (units < 1n) {
    throw new Error(
      `Expected units to be greater than or equal to 1, got ${options.units}`,
    );
  }

  const fetch = async () => {
    const contract = getStorageRegistry({
      client: options.client,
      chain: options.chain,
    });
    const bigNumberValue = (await usdUnitPrice({ contract })) * units;
    return Number(toTokens(bigNumberValue, 8)); // storage registry uses 8 decimal places
  };

  return withCache(fetch, {
    cacheKey: `${toBigInt(units)}:getUsdStoragePrice`,
    cacheTime: options.disableCache ? 0 : 5 * 60 * 1000, // 5 minutes
  });
}
