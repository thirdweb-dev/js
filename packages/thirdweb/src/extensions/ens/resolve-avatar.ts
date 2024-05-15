import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { parseAvatarRecord } from "../../utils/ens/avatar.js";
import { withCache } from "../../utils/promise/withCache.js";
import { resolveText } from "./resolve-text.js";

export type ResolveAvatarOptions = {
  client: ThirdwebClient;
  name: string;
  resolverAddress?: string;
  resolverChain?: Chain;
};

/**
 * Resolves an ENS name to the avatar URL.
 * @param options - The options for resolving an ENS address.
 * @example
 * ```ts
 * import { resolveAvatar } from "thirdweb/extensions/ens";
 * const address = await resolveAvatar({
 *    client,
 *    name: "vitalik.eth",
 * });
 * ```
 * @extension ENS
 * @returns A promise that resolves to the avatar url, or null if not set.
 */
export async function resolveAvatar(options: ResolveAvatarOptions) {
  const { client, name, resolverAddress, resolverChain } = options;
  return withCache(
    async () => {
      const record = await resolveText({
        client,
        key: "avatar",
        name,
        resolverAddress,
        resolverChain,
      });

      if (!record) {
        return null;
      }
      try {
        return parseAvatarRecord({ uri: record, client });
      } catch (e) {
        console.error("Error parsing avatar record", e);
        return null;
      }
    },
    {
      cacheKey: `ens:avatar:${name}`,
      // 1min cache
      cacheTime: 60 * 1000,
    },
  );
}
