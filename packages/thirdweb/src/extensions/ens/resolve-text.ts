import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { toHex } from "../../utils/encoding/hex.js";
import { namehash } from "../../utils/ens/namehash.js";
import { packetToBytes } from "../../utils/ens/packetToBytes.js";
import { withCache } from "../../utils/promise/withCache.js";
import {
  decodeTextResult,
  encodeText,
} from "./__generated__/AddressResolver/read/text.js";
import { resolve } from "./__generated__/UniversalResolver/read/resolve.js";
import { UNIVERSAL_RESOLVER_ADDRESS } from "./constants.js";

export type ResolveTextOptions = {
  client: ThirdwebClient;
  name: string;
  key: string;
  resolverAddress?: string;
  resolverChain?: Chain;
};

/**
 * Resolves an ENS name and key to the specified record.
 * @param options - The options for resolving an ENS address.
 * @example
 * ```ts
 * import { resolveText } from "thirdweb/extensions/ens";
 * const twitterUsername = await resolveText({
 *    client,
 *    name: "vitalik.eth",
 *    key: "com.twitter"
 * });
 * ```
 * @extension ENS
 * @returns A promise that resolves to the text record.
 */
export async function resolveText(options: ResolveTextOptions) {
  const { client, name, key, resolverAddress, resolverChain } = options;
  return withCache(
    async () => {
      const contract = getContract({
        client,
        chain: resolverChain || ethereum,
        address: resolverAddress || UNIVERSAL_RESOLVER_ADDRESS,
      });

      const data = encodeText({ name: namehash(name), key });

      const result = await resolve({
        contract,
        name: toHex(packetToBytes(name)),
        data,
      });

      if (result[0] === "0x") {
        return null;
      }

      const record = decodeTextResult(result[0]);

      return record === "" ? null : record;
    },
    {
      cacheKey: `ens:text:${name}:${key}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
