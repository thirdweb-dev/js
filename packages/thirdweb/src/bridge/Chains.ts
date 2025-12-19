import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { withCache } from "../utils/promise/withCache.js";
import type { Chain } from "./types/Chain.js";
import { ApiError } from "./types/Errors.js";

/**
 * Retrieves supported Bridge chains.
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

      if (options.testnet) {
        url.searchParams.set("testnet", options.testnet.toString());
      }

      // set type or originChainId or destinationChainId
      if ("type" in options && options.type) {
        url.searchParams.set("type", options.type);
      } else if ("originChainId" in options && options.originChainId) {
        url.searchParams.set("originChainId", options.originChainId.toString());
      } else if (
        "destinationChainId" in options &&
        options.destinationChainId
      ) {
        url.searchParams.set(
          "destinationChainId",
          options.destinationChainId.toString(),
        );
      }

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
      cacheKey: `bridge-chains-${JSON.stringify(options)}`,
      cacheTime: 1000 * 60 * 60 * 1, // 1 hours
    },
  );
}

/**
 * Namespace containing types for the chains function.
 * @namespace chains
 * @bridge
 */
export declare namespace chains {
  /**
   * Options for fetching supported bridge chains.
   * @interface Options
   * @bridge
   */
  type Options = {
    /** Your thirdweb client */
    client: ThirdwebClient;

    /**
     * If true, returns only testnet chains. Defaults to false.
     */
    testnet?: boolean;
  } & (
    | {
        /**
         * setting type=origin: Returns all chains that can be used as origin,
         * setting type=destination: Returns all chains that can be used as destination
         */
        type?: "origin" | "destination";
      }
    | {
        /**
         * setting originChainId=X: Returns destination chains reachable from chain X
         */
        originChainId?: number;
      }
    | {
        /**
         * setting destinationChainId=X: Returns origin chains reachable from chain X
         */
        destinationChainId?: number;
      }
  );

  /**
   * Result returned from fetching supported bridge chains.
   * Contains an array of supported chains.
   * @interface Result
   * @bridge
   */
  type Result = Chain[];
}
