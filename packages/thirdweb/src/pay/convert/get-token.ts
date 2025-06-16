import { tokens } from "../../bridge/Token.js";
import type { ThirdwebClient } from "../../client/client.js";
import { withCache } from "../../utils/promise/withCache.js";

export async function getTokenPrice(
  client: ThirdwebClient,
  tokenAddress: string,
  chainId: number,
) {
  return withCache(
    async () => {
      const result = await tokens({
        client,
        tokenAddress,
        chainId,
      });
      return result[0]?.priceUsd;
    },
    {
      cacheKey: `get-token-price-${tokenAddress}-${chainId}`,
      cacheTime: 1000 * 60, // 1 minute
    },
  );
}
