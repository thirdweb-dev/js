import type { Address as ox__Address, Hex as ox__Hex } from "ox";
import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";
import { UNIVERSAL_BRIDGE_URL } from "./constants.js";
import type { Route } from "./types/Route.js";

/**
 * Retrieves supported Universal Bridge routes based on the provided filters.
 *
 * When multiple filters are specified, a route must satisfy all filters to be included (it acts as an AND operator).
 *
 * @example
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * const routes = await Bridge.routes({
 *   client: thirdwebClient,
 * });
 * ```
 *
 * Returned routes might look something like:
 * ```typescript
 * [
 *    {
 *     destinationToken: {
 *       address: "0x12c88a3C30A7AaBC1dd7f2c08a97145F5DCcD830",
 *       chainId: 1,
 *       decimals: 18,
 *       iconUri: "https://assets.coingecko.com/coins/images/37207/standard/G.jpg",
 *       name: "G7",
 *       symbol: "G7",
 *     },
 *     originToken: {
 *       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *       chainId: 480,
 *       decimals: 18,
 *       iconUri: "https://assets.relay.link/icons/1/light.png",
 *       name: "Ether",
 *       symbol: "ETH",
 *     }
 *   },
 *   {
 *     destinationToken: {
 *       address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
 *       chainId: 1,
 *       decimals: 18,
 *       iconUri: "https://coin-images.coingecko.com/coins/images/24383/large/apecoin.jpg?1696523566",
 *       name: "ApeCoin",
 *       symbol: "APE",
 *     },
 *     originToken: {
 *       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *       chainId: 480,
 *       decimals: 18,
 *       iconUri: "https://assets.relay.link/icons/1/light.png",
 *       name: "Ether",
 *       symbol: "ETH",
 *     }
 *   }
 * ]
 * ```
 *
 * You can filter for specific chains or tokens:
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * // Get all routes starting from mainnet ETH
 * const routes = await Bridge.routes({
 *   originChainId: 1,
 *   originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *   client: thirdwebClient,
 * });
 * ```
 *
 * The returned routes will be limited based on the API. You can paginate through the results using the `limit` and `offset` parameters:
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * // Get the first 10 routes starting from mainnet ETH
 * const routes = await Bridge.routes({
 *   originChainId: 1,
 *   originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *   limit: 10,
 *   offset: 0,
 *   client: thirdwebClient,
 * });
 * ```
 *
 * @param options - The options for the quote.
 * @param options.client - Your thirdweb client.
 * @param options.originChainId - Filter by a specific origin chain ID.
 * @param options.originTokenAddress - Filter by a specific origin token address.
 * @param options.destinationChainId - Filter by a specific destination chain ID.
 * @param options.destinationTokenAddress - Filter by a specific destination token address.
 * @param options.transactionHash - Filter by a specific transaction hash.
 * @param options.limit - Limit the number of routes returned.
 * @param options.offset - Offset the number of routes returned.
 *
 * @returns A promise that resolves to an array of routes.
 *
 * @throws Will throw an error if there is an issue fetching the routes.
 * @bridge
 * @beta
 */
export async function routes(options: routes.Options): Promise<routes.Result> {
  const {
    client,
    originChainId,
    originTokenAddress,
    destinationChainId,
    destinationTokenAddress,
    limit,
    offset,
  } = options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${UNIVERSAL_BRIDGE_URL}/routes`);
  if (originChainId) {
    url.searchParams.set("originChainId", originChainId.toString());
  }
  if (originTokenAddress) {
    url.searchParams.set("originTokenAddress", originTokenAddress);
  }
  if (destinationChainId) {
    url.searchParams.set("destinationChainId", destinationChainId.toString());
  }
  if (destinationTokenAddress) {
    url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  }
  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }
  if (offset) {
    url.searchParams.set("offset", offset.toString());
  }

  const response = await clientFetch(url.toString());
  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(`${errorJson.code} | ${errorJson.message}`);
  }

  const { data }: { data: Route[] } = await response.json();
  return data;
}

export declare namespace routes {
  type Options = {
    client: ThirdwebClient;
    originChainId?: number;
    originTokenAddress?: ox__Address.Address;
    destinationChainId?: number;
    destinationTokenAddress?: ox__Address.Address;
    transactionHash?: ox__Hex.Hex;
    limit?: number;
    offset?: number;
  };

  type Result = Route[];
}
