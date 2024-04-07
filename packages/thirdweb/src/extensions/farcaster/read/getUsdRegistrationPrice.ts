import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { toBigInt } from "../../../utils/bigint.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { toTokens } from "../../../utils/units.js";
import { usdUnitPrice } from "../__generated__/IStorageRegistry/read/usdUnitPrice.js";
import { getStorageRegistry } from "../contracts/getStorageRegistry.js";

export type GetUsdRegistrationPriceParams = {
  client: ThirdwebClient;
  chain?: Chain;
  extraStorage?: bigint | number | string;
  disableCache?: boolean;
};

/**
 * Retrieves the current cost to register a Farcaster fid in USD.
 * @param options - An object containing a client to use to fetch the price and the amount of extra storage to include in the returned price.
 * @returns A promise that resolves to the current cost of a Farcaster fid in USD.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getUsdRegistrationPrice } from "thirdweb/extensions/farcaster";
 *
 * const price = await getUsdRegistrationPrice({
 *  client,
 * });
 * ```
 */
export async function getUsdRegistrationPrice(
  options: GetUsdRegistrationPriceParams,
): Promise<number> {
  const extraStorage = toBigInt(options.extraStorage ?? 0);
  if (extraStorage < 0n) {
    throw new Error(
      `Expected extraStorage to be greater than or equal to 0, got ${options.extraStorage}`,
    );
  }

  const fetch = async () => {
    const contract = getStorageRegistry({
      client: options.client,
      chain: options.chain,
    });
    const bigNumberValue =
      (await usdUnitPrice({ contract })) * (extraStorage + 1n);
    return Number(toTokens(bigNumberValue, 8)); // storage registry uses 8 decimal places
  };

  return withCache(fetch, {
    cacheKey: `${toBigInt(extraStorage)}:getUsdRegistrationPrice`,
    cacheTime: options.disableCache ? 0 : 5 * 60 * 1000, // 5 minutes
  });
}
