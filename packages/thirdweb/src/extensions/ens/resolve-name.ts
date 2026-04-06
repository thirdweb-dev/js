import type { Address } from "abitype";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { withCache } from "../../utils/promise/withCache.js";
import { reverse } from "./__generated__/UniversalResolver/read/reverse.js";
import { UNIVERSAL_RESOLVER_ADDRESS } from "./constants.js";

/**
 * @extension ENS
 */
export type ResolveNameOptions = {
  client: ThirdwebClient;
  address: Address;
  resolverAddress?: string;
  resolverChain?: Chain;
};

/**
 * Resolves the primary name for a specified address.
 * @param options - The options for resolving an ENS address.
 * @example
 * ```ts
 * import { resolveName } from "thirdweb/extensions/ens";
 * const name = await resolveName({
 *    client,
 *    address: "0x1234...",
 * });
 * ```
 * @extension ENS
 * @returns A promise that resolves to the Ethereum address.
 */
export async function resolveName(
  options: ResolveNameOptions,
): Promise<string | null> {
  const { client, address, resolverAddress, resolverChain } = options;

  return withCache(
    async () => {
      const contract = getContract({
        address: resolverAddress || UNIVERSAL_RESOLVER_ADDRESS,
        chain: resolverChain || ethereum,
        client,
      });

      const [name] = await reverse({
        contract,
        reverseName: address as `0x${string}`,
        coinType: 60n,
      }).catch((e) => {
        // Re-throw verification errors so callers can detect data integrity issues
        if (
          typeof e === "object" &&
          e !== null &&
          "data" in e &&
          typeof e.data === "string"
        ) {
          // ReverseAddressMismatch(string,bytes) = 0xef9c03ce
          if (e.data.startsWith("0xef9c03ce")) {
            throw e;
          }
        }
        // Swallow expected "no resolver" / "no name" errors
        return [null] as const;
      });

      return name || null;
    },
    {
      cacheKey: `ens:name:${resolverChain?.id || 1}:${address}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
