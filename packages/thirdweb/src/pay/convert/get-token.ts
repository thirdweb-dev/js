import { tokens } from "../../bridge/Token.js";
import type { ThirdwebClient } from "../../client/client.js";
import { withCache } from "../../utils/promise/withCache.js";

export async function getToken(
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
      const token = result[0];
      if (!token) {
        throw new Error("Token not found");
      }
      return token;
    },
    {
      cacheKey: `get-token-price-${tokenAddress}-${chainId}`,
      cacheTime: 1000 * 60, // 1 minute
    },
  );
}
