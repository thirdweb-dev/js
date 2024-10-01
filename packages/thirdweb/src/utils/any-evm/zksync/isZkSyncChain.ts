import type { Chain } from "../../../chains/types.js";
import { withCache } from "../../promise/withCache.js";

export async function isZkSyncChain(chain: Chain) {
  if (chain.id === 1337 || chain.id === 31337) {
    return false;
  }

  const stack = await getChainStack(chain.id).catch(() => {
    // fall back to checking against these zksync chain-ids
    if (
      chain.id === 324 ||
      chain.id === 300 ||
      chain.id === 302 ||
      chain.id === 11124 ||
      chain.id === 282 || // cronos zkevm testnet
      chain.id === 388 // cronos zkevm mainnet
    ) {
      return "zksync-stack";
    }

    return "";
  });

  return stack === "zksync-stack";
}

async function getChainStack(chainId: number): Promise<string> {
  return withCache(
    async () => {
      const res = await fetch(`https://${chainId}.rpc.thirdweb.com/stack`);

      if (!res.ok) {
        res.body?.cancel();
        throw new Error(`Error fetching stack for ${chainId}`);
      }

      const data = await res.json();

      return data.stack;
    },
    { cacheKey: `stack:${chainId}`, cacheTime: 24 * 60 * 60 * 1000 },
  );
}
