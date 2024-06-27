import type { Address } from "abitype";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { toHex } from "../../utils/encoding/hex.js";
import { packetToBytes } from "../../utils/ens/packetToBytes.js";
import { withCache } from "../../utils/promise/withCache.js";
import { reverse } from "./__generated__/UniversalResolver/read/reverse.js";
import { UNIVERSAL_RESOLVER_ADDRESS } from "./constants.js";

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
export async function resolveName(options: ResolveNameOptions) {
  const { client, address, resolverAddress, resolverChain } = options;

  return withCache(
    async () => {
      const contract = getContract({
        client,
        chain: resolverChain || ethereum,
        address: resolverAddress || UNIVERSAL_RESOLVER_ADDRESS,
      });

      const reverseName = toHex(
        packetToBytes(`${address.toLowerCase().substring(2)}.addr.reverse`),
      );

      const [name, resolvedAddress] = await reverse({
        contract,
        reverseName,
      }).catch((e) => {
        if ("data" in e && e.data === "0x7199966d") {
          return [null, address] as const;
        }
        throw e;
      });

      if (address.toLowerCase() !== resolvedAddress.toLowerCase()) {
        return null;
      }

      return name;
    },
    {
      cacheKey: `ens:name:${address}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
