import type { Address } from "abitype";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { nonces } from "../__generated__/IKeyGateway/read/nonces.js";
import { getKeyGateway } from "../contracts/getKeyGateway.js";

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
  const fetch = () => {
    const contract = getKeyGateway({
      client: options.client,
      chain: options.chain,
    });
    return nonces({ contract, account: options.address });
  };

  return withCache(fetch, {
    cacheKey: `${options.address}:getNonce`,
    cacheTime: options.disableCache ? 0 : 5 * 60 * 1000, // 5 minutes
  });
}
