import type { ThirdwebClient } from "../../../client/client.js";
import { withCache } from "../../../utils/promise/withCache.js";
import type { Chain } from "../../../chains/types.js";
import type { Address } from "abitype";

export type GetFidParams = {
  client: ThirdwebClient;
  address: Address;
  chain?: Chain;
  disableCache?: boolean;
};

/**
 * Retrieves the current fid for an account.
 * @param options - Parameters to pass to the function.
 * @returns A promise that resolves to the account's fid, if one exists, otherwise 0.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getFid } from "thirdweb/extensions/farcaster";
 *
 * const price = await getFid({
 *  client,
 * 	address,
 * });
 * ```
 */
export async function getFid(options: GetFidParams): Promise<bigint> {
  const fetch = async () => {
    const { getIdRegistry } = await import("../contracts.js");
    const { idOf } = await import("../__generated__/IIdRegistry/read/idOf.js");

    const contract = getIdRegistry({
      client: options.client,
      chain: options.chain,
    });
    return idOf({ contract, owner: options.address });
  };

  if (options.disableCache) return fetch();

  return withCache(fetch, {
    cacheKey: `${options.address}:getFid`,
    cacheTime: 60 * 60 * 1000, // 60 minutes
  });
}
