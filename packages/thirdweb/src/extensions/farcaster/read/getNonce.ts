import type { ThirdwebClient } from "../../../client/client.js";
import { withCache } from "../../../utils/promise/withCache.js";
import type { Chain } from "../../../chains/types.js";
import type { Address } from "abitype";

export type GetNonceParams = {
  client: ThirdwebClient;
  address: Address;
  chain?: Chain;
  disableCache?: boolean;
};

/**
 * Retrieves the current key gateway nonce for an account.
 * @param options - Parameters to pass to the function.
 * @returns A promise that resolves to the current nonce.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getNonce } from "thirdweb/extensions/farcaster";
 *
 * const nonce = await getNonce({
 *  client,
 * 	address,
 * });
 * ```
 */
export async function getNonce(options: GetNonceParams): Promise<bigint> {
  const fetch = async () => {
    const { getKeyGateway } = await import("../contracts.js");
    const { nonces } = await import(
      "../__generated__/IKeyGateway/read/nonces.js"
    );

    const contract = getKeyGateway({
      client: options.client,
      chain: options.chain,
    });
    return nonces({ contract, account: options.address });
  };

  if (options.disableCache) return fetch();

  return withCache(fetch, {
    cacheKey: `${options.address}:getNonce`,
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}
