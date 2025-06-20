import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { getAddress, isAddress } from "../../../utils/address.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { exists } from "../__generated__/UnstoppableDomains/read/exists.js";
import { getMany } from "../__generated__/UnstoppableDomains/read/getMany.js";
import { namehash } from "../__generated__/UnstoppableDomains/read/namehash.js";
import { UD_POLYGON_MAINNET } from "../consts.js";

/**
 * @extension UNSTOPPABLE-DOMAINS
 */
export type ResolveAddressOptions = {
  client: ThirdwebClient;
  name: string;
  resolverAddress?: string;
  resolverChain?: Chain;
};

/**
 * Resolve an Unstoppable-Domain domain to an Ethereum address
 * @param options - The options for resolving an UD domain
 * @returns The Ethereum address associated with the domain name. [Learn more](https://docs.unstoppabledomains.com/reverse-resolution/)
 * @example
 *
 * ### Basic usage
 * ```ts
 * import { resolveAddress } from "thirdweb/extension/unstoppable-domains";
 *
 * const address = await resolveAddress({
 *   client,
 *   name: "thirdweb.crypto",
 * });
 * ```
 *
 * ### Custom resolver
 * By default this extension will try to resolve the name on Polygon mainnet,
 * you can decide to customize the resolver contract by specifying `resolverAddress` and `resolverChain`
 * ```ts
 * import { ethereum } from "thirdweb/chains";
 *
 * const address = await resolveAddress({
 *   client,
 *   name: "thirdweb.crypto",
 *   resolverAddress: "0x...",
 *   resolverChain: ethereum,
 * });
 * ```
 *
 * @extension UNSTOPPABLE-DOMAINS
 */
export async function resolveAddress(
  options: ResolveAddressOptions,
): Promise<string> {
  const { client, name, resolverAddress, resolverChain } = options;
  if (isAddress(name)) {
    return getAddress(name);
  }
  return withCache(
    async () => {
      const contract = getContract({
        address: resolverAddress || UD_POLYGON_MAINNET,
        chain: resolverChain || polygon,
        client,
      });

      // Get namehash
      const possibleTokenId = await namehash({
        contract,
        labels: name.split("."),
      });

      // `namehash` always return a value, we should use `exists` to make sure it's valid
      const _exists = await exists({ contract, tokenId: possibleTokenId });
      if (!_exists) {
        throw new Error(
          `Could not resolve a valid tokenId from the domain: ${name}. Make sure it exists.`,
        );
      }

      // Resolve ETH address from the tokenId
      const resolved = await getMany({
        contract,
        // note that you can also retrieve the (BTC, SOL, etc.) address by using "crypto.<symbol>.address" (should that become useful one day)
        keys: ["crypto.ETH.address"],
        tokenId: possibleTokenId,
      });

      const possibleETHAddress = resolved[0];
      if (!possibleETHAddress) {
        throw new Error(
          `Could not retrieve any ETH address associated with domain name: ${name}. Make sure you have set the base EVM address for your domain here: https://unstoppabledomains.com/manage?page=crypto&domain=<your-domain>`,
        );
      }
      return possibleETHAddress;
    },
    {
      cacheKey: `unstoppable-domain:addr:${resolverChain?.id || 1}:${name}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
