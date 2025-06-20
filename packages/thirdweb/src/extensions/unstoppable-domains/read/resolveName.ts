import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { reverseNameOf } from "../__generated__/UnstoppableDomains/read/reverseNameOf.js";
import { UD_POLYGON_MAINNET } from "../consts.js";

/**
 * @extension UNSTOPPABLE-DOMAINS
 */
export type ResolveUDNameOptions = {
  client: ThirdwebClient;
  address: string;
  resolverAddress?: string;
  resolverChain?: Chain;
};

/**
 * Resolves the primary Untoppable-Domains name for a specified address.
 * @param options - The options for resolving an UD domain
 * @example
 *
 * ### Basic usage
 * ```ts
 * import { resolveName } from "thirdweb/extension/unstoppable-domains";
 *
 * const name = await resolveName({
 *   client,
 *   address: "0x...",
 * });
 * ```
 *
 * ### Custom resolver
 * By default this extension will try to resolve the address on Polygon mainnet,
 * you can decide to customize the resolver contract by specifying `resolverAddress` and `resolverChain`
 * ```ts
 * import { ethereum } from "thirdweb/chains";
 *
 * const address = await resolveName({
 *   client,
 *   address: "0x...",
 *   resolverAddress: "0x...",
 *   resolverChain: ethereum,
 * });
 * ```
 * @extension UNSTOPPABLE-DOMAINS
 */
export async function resolveName(
  options: ResolveUDNameOptions,
): Promise<string> {
  const { client, address, resolverAddress, resolverChain } = options;
  return withCache(
    async () => {
      const contract = getContract({
        address: resolverAddress || UD_POLYGON_MAINNET,
        chain: resolverChain || polygon,
        client,
      });

      // Note: if the given wallet address does not have any UD name, `reverseNameOf` will return an empty string
      // This can still happen if you have transferred a domain to a new address, and forgot to set up the Reverse Resolution on the new address
      const domain = await reverseNameOf({ addr: address, contract });
      if (!domain) {
        throw new Error(
          `Failed to retrieve domain for address: ${address}. Make sure you have set the Reverse Resolution address for your domain at https://unstoppabledomains.com/manage?page=reverseResolution&domain=your-domain`,
        );
      }
      return domain;
    },
    {
      cacheKey: `unstoppable-domain:name:${resolverChain?.id || 1}:${address}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
