import type { Address } from "abitype";
import { type Hex, encodePacked, keccak256, namehash } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { withCache } from "../../utils/promise/withCache.js";
import { name } from "./__generated__/L2Resolver/read/name.js";

/**
 * @extension ENS
 */
export type ResolveL2NameOptions = {
  client: ThirdwebClient;
  address: Address;
  resolverAddress: string;
  resolverChain: Chain;
};

/**
 * Convert an address to a reverse node for ENS resolution
 *
 * @internal
 */
const convertReverseNodeToBytes = (address: Address, chainId: number) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Hex);
  const cointype = (0x80000000 | chainId) >>> 0;

  const chainCoinType = cointype.toString(16).toLocaleUpperCase();
  const reverseNode = namehash(`${chainCoinType.toLocaleUpperCase()}.reverse`);

  const addressReverseNode = keccak256(
    encodePacked(["bytes32", "bytes32"], [reverseNode, addressNode]),
  );
  return addressReverseNode;
};

/**
 * Resolves the L2 name for a specified address.
 * @param options - The options for resolving an L2 ENS address.
 * @example
 * ```ts
 * import { resolveL2Name } from "thirdweb/extensions/ens";
 * const name = await resolveL2Name({
 *    client,
 *    address: "0x1234...",
 *    resolverAddress: "0x...",
 *    resolverChain: base,
 * });
 * ```
 *
 * Resolve a Basename.
 * ```ts
 * import { resolveL2Name, BASENAME_RESOLVER_ADDRESS } from "thirdweb/extensions/ens";
 * import { base } from "thirdweb/chains";
 * const name = await resolveL2Name({
 *    client,
 *    address: "0x1234...",
 *    resolverAddress: BASENAME_RESOLVER_ADDRESS,
 *    resolverChain: base,
 * });
 * ```
 * @extension ENS
 * @returns A promise that resolves to the Ethereum address.
 */
export async function resolveL2Name(options: ResolveL2NameOptions) {
  const { client, address, resolverAddress, resolverChain } = options;

  return withCache(
    async () => {
      const contract = getContract({
        client,
        chain: resolverChain,
        address: resolverAddress,
      });

      const reverseName = convertReverseNodeToBytes(
        address,
        resolverChain.id || 1,
      );

      const resolvedName = await name({
        contract,
        node: reverseName,
      }).catch((e) => {
        if ("data" in e && e.data === "0x7199966d") {
          return null;
        }
        throw e;
      });

      if (resolvedName === "") {
        return null;
      }

      return resolvedName;
    },
    {
      cacheKey: `ens:name:${resolverChain}:${address}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
