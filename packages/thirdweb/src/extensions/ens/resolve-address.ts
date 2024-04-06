import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { resolve } from "./__generated__/UniversalResolver/read/resolve.js";
import { toHex } from "../../utils/encoding/hex.js";
import { namehash } from "../../utils/ens/namehash.js";
import { packetToBytes } from "../../utils/ens/packetToBytes.js";
import { getAddress, isAddress } from "../../utils/address.js";
import type { Chain } from "../../chains/types.js";
import {
  encodeAddrParams,
  FN_SELECTOR as addrFnSelector,
} from "./__generated__/AddressResolver/read/addr.js";
import { concatHex } from "viem";
import { UNIVERSAL_RESOLVER_ADDRESS } from "./constants.js";
import { withCache } from "../../utils/promise/withCache.js";

export type ResolveAddressOptions = {
  client: ThirdwebClient;
  name: string;
  resolverAddress?: string;
  resolverChain?: Chain;
};

/**
 * Resolves an ENS name to an Ethereum address.
 * @param options - The options for resolving an ENS address.
 * @example
 * ```ts
 * import { resolveAddress } from "thirdweb/ens";
 * const address = await resolveAddress({
 *    client,
 *    name: "vitalik.eth",
 * });
 * ```
 * @extension ENS
 * @returns A promise that resolves to the Ethereum address.
 */
export async function resolveAddress(options: ResolveAddressOptions) {
  const { client, name, resolverAddress, resolverChain } = options;
  if (isAddress(name)) {
    return getAddress(name);
  }
  return withCache(
    async () => {
      const contract = getContract({
        client,
        chain: resolverChain || ethereum,
        address: resolverAddress || UNIVERSAL_RESOLVER_ADDRESS,
      });
      const data = concatHex([
        addrFnSelector,
        encodeAddrParams({ name: namehash(name) }),
      ]);
      const result = await resolve({
        contract,
        name: toHex(packetToBytes(name)),
        data,
      });
      const resolvedAddress = getAddress(`0x${result[0].slice(-40)}`);

      return resolvedAddress;
    },
    {
      cacheKey: `ens:addr:${name}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
