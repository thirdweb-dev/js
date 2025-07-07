import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { withCache } from "../utils/promise/withCache.js";
import type { Chain } from "./types/Chain.js";
import { ApiError } from "./types/Errors.js";

/**
 * Retrieves supported Universal Bridge chains.
 *
 * @example
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * const chains = await Bridge.chains({
 *   client: thirdwebClient,
 * });
 * ```
 *
 * Returned chains might look something like:
 * ```typescript
 * [
 *   {
 *     chainId: 1,
 *     name: "Ethereum",
 *     icon: "https://assets.thirdweb.com/chains/1.png",
 *     nativeCurrency: {
 *       name: "Ether",
 *       symbol: "ETH",
 *       decimals: 18
 *     }
 *   },
 *   {
 *     chainId: 137,
 *     name: "Polygon",
 *     icon: "https://assets.thirdweb.com/chains/137.png",
 *     nativeCurrency: {
 *       name: "MATIC",
 *       symbol: "MATIC",
 *       decimals: 18
 *     }
 *   }
 * ]
 * ```
 *
 * @param options - The options for fetching chains.
 * @param options.client - Your thirdweb client.
 *
 * @returns A promise that resolves to an array of chains.
 *
 * @throws Will throw an error if there is an issue fetching the chains.
 * @bridge
 * @beta
 */
export async function chains(options: chains.Options): Promise<chains.Result> {
  const { client } = options;

  return withCache(
    async () => {
      const clientFetch = getClientFetch(client);
      const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/chains`);

      const response = await clientFetch(url.toString());
      if (!response.ok) {
        const errorJson = await response.json();
        throw new ApiError({
          code: errorJson.code || "UNKNOWN_ERROR",
          correlationId: errorJson.correlationId || undefined,
          message: errorJson.message || response.statusText,
          statusCode: response.status,
        });
      }

      const { data }: { data: Chain[] } = await response.json();
      return data;
    },
    {
      cacheKey: "bridge-chains",
      cacheTime: 1000 * 60 * 60 * 1, // 1 hours
    },
  );
}

export declare namespace chains {
  type Options = {
    client: ThirdwebClient;
  };

  type Result = Chain[];
}
