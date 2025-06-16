import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import { ApiError } from "./types/Errors.js";
import type { Token } from "./types/Token.js";

/**
 * Retrieves supported Universal Bridge tokens based on the provided filters.
 *
 * When multiple filters are specified, a token must satisfy all filters to be included (it acts as an AND operator).
 *
 * @example
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * const tokens = await Bridge.tokens({
 *   client: thirdwebClient,
 * });
 * ```
 *
 * Returned tokens might look something like:
 * ```typescript
 * [
 *   {
 *     chainId: 1,
 *     address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
 *     decimals: 18,
 *     symbol: "ETH",
 *     name: "Ethereum",
 *     iconUri: "https://assets.relay.link/icons/1/light.png",
 *     priceUsd: 2000.50
 *   },
 *   {
 *     chainId: 1,
 *     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 *     decimals: 6,
 *     symbol: "USDC",
 *     name: "USD Coin",
 *     iconUri: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
 *     priceUsd: 1.00
 *   }
 * ]
 * ```
 *
 * You can filter for specific chains or tokens:
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * // Get all tokens on Ethereum mainnet
 * const ethTokens = await Bridge.tokens({
 *   chainId: 1,
 *   client: thirdwebClient,
 * });
 * ```
 *
 * You can search for tokens by symbol or name:
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * // Search for USDC tokens
 * const usdcTokens = await Bridge.tokens({
 *   symbol: "USDC",
 *   client: thirdwebClient,
 * });
 *
 * // Search for tokens by name
 * const ethereumTokens = await Bridge.tokens({
 *   name: "Ethereum",
 *   client: thirdwebClient,
 * });
 * ```
 *
 * You can filter by a specific token address:
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * // Get a specific token
 * const token = await Bridge.tokens({
 *   tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 *   client: thirdwebClient,
 * });
 * ```
 *
 * The returned tokens will be limited based on the API. You can paginate through the results using the `limit` and `offset` parameters:
 * ```typescript
 * import { Bridge } from "thirdweb";
 *
 * // Get the first 50 tokens
 * const tokens = await Bridge.tokens({
 *   limit: 50,
 *   offset: 0,
 *   client: thirdwebClient,
 * });
 *
 * // Get the next 50 tokens
 * const nextTokens = await Bridge.tokens({
 *   limit: 50,
 *   offset: 50,
 *   client: thirdwebClient,
 * });
 * ```
 *
 * @param options - The options for retrieving tokens.
 * @param options.client - Your thirdweb client.
 * @param options.chainId - Filter by a specific chain ID.
 * @param options.tokenAddress - Filter by a specific token address.
 * @param options.symbol - Filter by token symbol.
 * @param options.name - Filter by token name.
 * @param options.limit - Number of tokens to return (min: 1, default: 100).
 * @param options.offset - Number of tokens to skip (min: 0, default: 0).
 *
 * @returns A promise that resolves to an array of tokens.
 *
 * @throws Will throw an error if there is an issue fetching the tokens.
 * @bridge
 * @beta
 */
export async function tokens(options: tokens.Options): Promise<tokens.Result> {
  const { client, chainId, tokenAddress, symbol, name, limit, offset } =
    options;

  const clientFetch = getClientFetch(client);
  const url = new URL(`${getThirdwebBaseUrl("bridge")}/v1/tokens`);

  if (chainId !== null && chainId !== undefined) {
    url.searchParams.set("chainId", chainId.toString());
  }
  if (tokenAddress) {
    url.searchParams.set("tokenAddress", tokenAddress);
  }
  if (symbol) {
    url.searchParams.set("symbol", symbol);
  }
  if (name) {
    url.searchParams.set("name", name);
  }
  if (limit !== undefined) {
    url.searchParams.set("limit", limit.toString());
  }
  if (offset !== null && offset !== undefined) {
    url.searchParams.set("offset", offset.toString());
  }

  const response = await clientFetch(url.toString());
  if (!response.ok) {
    const errorJson = await response.json();
    throw new ApiError({
      code: errorJson.code || "UNKNOWN_ERROR",
      message: errorJson.message || response.statusText,
      correlationId: errorJson.correlationId || undefined,
      statusCode: response.status,
    });
  }

  const { data }: { data: Token[] } = await response.json();
  return data;
}

export declare namespace tokens {
  /**
   * Input parameters for {@link Bridge.tokens}.
   */
  type Options = {
    /** Your {@link ThirdwebClient} instance. */
    client: ThirdwebClient;
    /** Filter by a specific chain ID. */
    chainId?: number | null;
    /** Filter by a specific token address. */
    tokenAddress?: string;
    /** Filter by token symbol. */
    symbol?: string;
    /** Filter by token name. */
    name?: string;
    /** Number of tokens to return (min: 1, default: 100). */
    limit?: number;
    /** Number of tokens to skip (min: 0, default: 0). */
    offset?: number | null;
  };

  /**
   * The result returned from {@link Bridge.tokens}.
   */
  type Result = Token[];
}
