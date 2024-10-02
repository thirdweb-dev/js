import type { Chain } from "../../../chains/types.js";
import { withCache } from "../../promise/withCache.js";

export async function isZkSyncChain(chain: Chain) {
  if (chain.id === 1337 || chain.id === 31337) {
    return false;
  }

  // check known zksync chain-ids first
  if (
    chain.id === 324 ||
    chain.id === 300 ||
    chain.id === 302 ||
    chain.id === 11124 ||
    chain.id === 282 || // cronos zkevm testnet
    chain.id === 388 // cronos zkevm mainnet
  ) {
    return true;
  }

  // fallback to checking the stack on rpc
  try {
    const stack = await getChainStack(chain.id);
    return stack === "zksync-stack";
  } catch {
    // If the network check fails, assume it's not a ZkSync chain
    return false;
  }
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
