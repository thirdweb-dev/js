import type { ThirdwebClient } from "../../../client/client.js";
import { withCache } from "../../../utils/promise/withCache.js";

export type GetRegistrationPriceOptions = {
  client: ThirdwebClient;
  extraStorage?: bigint | number | string;
  disableCache?: boolean;
};

/**
 * Retrieves the current cost to register a Farcaster fid.
 * @param options - An object containing a client to use to fetch the price and the amount of extra storage to include in the returned price.
 * @returns A promise that resolves to the current cost of a Farcaster fid in wei.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getRegistrationPrice } from "thirdweb/extensions/farcaster";
 *
 * const price = await getRegistrationPrice({
 *  client,
 * });
 * ```
 */
export async function getRegistrationPrice({
  client,
  extraStorage = 0n,
  disableCache = false, // allow disabling the cache if necessary
}: GetRegistrationPriceOptions): Promise<bigint> {
  const fetch = async () => {
    const { getIdGateway } = await import("../contracts.js");
    const { price } = await import("../__generated__/IIdGateway/read/price.js");

    const contract = getIdGateway({ client });
    return price({ contract, extraStorage: BigInt(extraStorage) });
  };

  if (disableCache) return fetch();

  return withCache(fetch, {
    cacheKey: `${BigInt(extraStorage)}:getFidPrice`,
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}
