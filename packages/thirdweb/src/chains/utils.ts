import type { ThirdwebClient } from "../client/client.js";
import { isThirdwebUrl } from "../utils/fetch.js";
import { withCache } from "../utils/promise/withCache.js";
import type { ApiChain, Chain, ChainOptions } from "./types.js";
import type { Chain as ViemChain } from "viem";

/**
 * Defines a chain with the given options.
 * @param options The options for the chain.
 * @returns The defined chain.
 * @example
 * ```ts
 * const chain = defineChain({
 *  id: 1,
 *  nativeCurrency: {
 *    name: "Ether",
 *    symbol: "ETH",
 *    decimals: 18,
 *  },
 * });
 * ```
 */
export function defineChain(options: number | ChainOptions | ViemChain): Chain {
  if (typeof options === "number") {
    return { id: options, rpc: `https://${options}.rpc.thirdweb.com` } as const;
  }
  if (isViemChain(options)) {
    return convertViemChain(options);
  }
  // otherwise if it's not a viem chain, continue
  let rpc = options.rpc;
  if (!rpc) {
    rpc = `https://${options.id}.rpc.thirdweb.com`;
  }
  return { ...options, rpc } as const;
}

function isViemChain(chain: ChainOptions | ViemChain): chain is ViemChain {
  return "rpcUrls" in chain && !("rpc" in chain);
}

function convertViemChain(viemChain: ViemChain): Chain {
  return defineChain({
    id: viemChain.id,
    name: viemChain.name,
    nativeCurrency: {
      name: viemChain.nativeCurrency.name,
      symbol: viemChain.nativeCurrency.symbol,
      decimals: viemChain.nativeCurrency.decimals,
    },
    blockExplorers: viemChain?.blockExplorers
      ? Object.values(viemChain?.blockExplorers).map((explorer) => {
          return {
            name: explorer.name,
            url: explorer.url,
            apiUrl: explorer.apiUrl,
          };
        })
      : [],
  });
}

type GetRpcUrlForChainOptions = {
  client: ThirdwebClient;
  chain: Chain | number;
};

/**
 * Retrieves the RPC URL for the specified chain.
 * If a custom RPC URL is defined in the options, it will be used.
 * Otherwise, a thirdweb RPC URL will be constructed using the chain ID and client ID.
 * @param options - The options object containing the chain and client information.
 * @returns The RPC URL for the specified chain.
 * @internal
 */
export function getRpcUrlForChain(options: GetRpcUrlForChainOptions): string {
  // if the chain is just a number, construct the RPC URL using the chain ID and client ID
  if (typeof options.chain === "number") {
    return `https://${options.chain}.rpc.thirdweb.com/${options.client.clientId}`;
  }
  const { rpc } = options.chain;

  // add on the client ID to the RPC URL if it's a thirdweb URL
  if (isThirdwebUrl(rpc)) {
    const rpcUrl = new URL(options.chain.rpc);
    rpcUrl.pathname = `/${options.client.clientId}`;
    return rpcUrl.toString();
  }
  return rpc;
}

/**
 * Retrieves the chain symbol from the provided chain.
 * @param chain - The chain.
 * @returns The chain symbol.
 * @internal
 */
export async function getChainSymbol(chain: Chain): Promise<string> {
  if (!chain.nativeCurrency?.symbol) {
    return getChainDataForChain(chain)
      .then((data) => data.nativeCurrency.symbol)
      .catch(() => {
        // if we fail to fetch the chain data, return "ETH" as a fallback
        return "ETH";
      });
  }
  // if we have a symbol, return it
  return chain.nativeCurrency.symbol;
}

/**
 * Retrieves the number of decimals for the native currency of a given chain.
 * If the chain is not recognized or the data cannot be fetched, it returns a fallback value of 18.
 * @param chain - The chain for which to retrieve the decimals.
 * @returns A promise that resolves to the number of decimals for the native currency of the chain.
 * @internal
 */
export async function getChainDecimals(chain: Chain): Promise<number> {
  if (!chain.nativeCurrency?.decimals) {
    return getChainDataForChain(chain)
      .then((data) => data.nativeCurrency.decimals)
      .catch(() => {
        // if we fail to fetch the chain data, return 18 as a fallback (most likely it's 18)
        return 18;
      });
  }
  // if we have decimals, return it
  return chain.nativeCurrency.decimals;
}

/**
 * Retrieves the name of the native currency for a given chain.
 * If the chain object does not have a native currency name, it attempts to fetch the chain data and retrieve the native currency name from there.
 * If fetching the chain data fails, it falls back to returning "ETH".
 * @param chain The chain object for which to retrieve the native currency name.
 * @returns A promise that resolves to the native currency name.
 * @internal
 */
export async function getChainNativeCurrencyName(
  chain: Chain,
): Promise<string> {
  if (!chain.nativeCurrency?.name) {
    return getChainDataForChain(chain)
      .then((data) => data.nativeCurrency.name)
      .catch(() => {
        // if we fail to fetch the chain data, return 18 as a fallback (most likely it's 18)
        return "ETH";
      });
  }
  // if we have a name, return it
  return chain.nativeCurrency.name;
}

type FetchChainResponse =
  | {
      data: ApiChain;
      error?: never;
    }
  | {
      data?: never;
      error: unknown;
    };

/**
 * @internal
 */
export function getChainDataForChain(chain: Chain): Promise<ApiChain> {
  const chainId = chain.id;
  return withCache(
    async () => {
      const res = await fetch(`https://api.thirdweb.com/v1/chains/${chainId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
      }

      const response = (await res.json()) as FetchChainResponse;
      if (response.error) {
        throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
      }
      if (!response.data) {
        throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
      }

      const data = response.data;

      return {
        ...data,
        name: chain?.name || data.name,
        chainId: chain?.id || data.chainId,
        rpc: chain?.rpc ? [chain.rpc] : data.rpc,
        testnet: chain?.testnet || data.testnet,
        nativeCurrency: chain?.nativeCurrency
          ? {
              ...data.nativeCurrency,
              ...chain.nativeCurrency,
            }
          : data.nativeCurrency,
        // TODO: handle explorers - don't know what should be the standard
        // explorers: chain?.blockExplorers
        //   ? chain.blockExplorers.map((x) => {
        //       return {
        //         name: x.name,
        //         url: x.url,
        //         standard: '' /// ???
        //       };
        //     })
        //   : result.data.explorers,
      };
    },
    {
      cacheKey: `chain:${chainId}`,
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Convert `ApiChain` to `Chain` object
 * @internal
 */
export function convertApiChainToChain(apiChain: ApiChain): Chain {
  return {
    id: apiChain.chainId,
    name: apiChain.name,
    rpc: apiChain.rpc[0] || "",
    testnet: apiChain.testnet === true ? true : undefined,
    nativeCurrency: apiChain.nativeCurrency,
    blockExplorers: apiChain.explorers?.map((explorer) => {
      return {
        name: explorer.name,
        url: explorer.url,
        apiUrl: explorer.url,
      };
    }),
  };
}
