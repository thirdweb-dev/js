import { add, tokens } from "../../bridge/Token.js";
import type { Token } from "../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../client/client.js";
import { withCache } from "../../utils/promise/withCache.js";

export async function getToken(
  client: ThirdwebClient,
  tokenAddress: string,
  chainId: number,
): Promise<Token> {
  return withCache(
    async () => {
      const result = await tokens({
        chainId,
        client,
        tokenAddress,
      });
      const token = result[0];
      if (!token) {
        // Attempt to add the token
        const tokenResult = await add({
          chainId,
          client,
          tokenAddress,
        }).catch(() => {
          throw new Error("Token not supported");
        });
        return tokenResult;
      }
      return token;
    },
    {
      cacheKey: `get-token-price-${tokenAddress}-${chainId}`,
      cacheTime: 1000 * 60, // 1 minute
    },
  );
}
