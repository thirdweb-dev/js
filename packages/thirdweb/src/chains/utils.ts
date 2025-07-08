import type { Chain as ViemChain } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { DEFAULT_RPC_URL, getThirdwebDomains } from "../utils/domains.js";
import { isThirdwebUrl } from "../utils/fetch.js";
import { withCache } from "../utils/promise/withCache.js";
import type {
  Chain,
  ChainMetadata,
  ChainOptions,
  LegacyChain,
} from "./types.js";

/**
 * @internal Exported for tests
 */
export const CUSTOM_CHAIN_MAP = new Map<number, Chain>();

/**
 * Defines a chain with the given options.
 * @param options The options for the chain.
 * @returns The defined chain.
 * @example
 * Just pass the chain ID to connect to:
 * ```ts
 * const chain = defineChain(1);
 * ```
 * Or pass your own RPC or custom values:
 * ```ts
 * const chain = defineChain({
 *  id: 1,
 *  rpc: "https://my-rpc.com",
 *  nativeCurrency: {
 *    name: "Ether",
 *    symbol: "ETH",
 *    decimals: 18,
 *  },
 * });
 * ```
 * @chain
 */
export function defineChain(
  options: number | ChainOptions | ViemChain | LegacyChain,
): Chain {
  const RPC_URL = getThirdwebDomains().rpc;
  if (typeof options === "number") {
    return {
      id: options,
      rpc: `https://${options}.${RPC_URL}`,
    } as const;
  }
  if (isViemChain(options)) {
    return convertViemChain(options);
  }
  if (isLegacyChain(options)) {
    return convertLegacyChain(options);
  }
  // otherwise if it's not a viem chain, continue
  let rpc = options.rpc;
  if (!rpc) {
    rpc = `https://${options.id}.${RPC_URL}`;
  }
  const chain = { ...options, rpc } as const;
  CUSTOM_CHAIN_MAP.set(options.id, chain);
  return chain;
}

/**
 * @internal
 */
export function cacheChains(chains: Chain[]) {
  for (const chain of chains) {
    CUSTOM_CHAIN_MAP.set(chain.id, chain);
  }
}

/**
 * @internal
 */
export function getCachedChain(id: number) {
  if (CUSTOM_CHAIN_MAP.has(id)) {
    return CUSTOM_CHAIN_MAP.get(id) as Chain;
  }
  const RPC_URL = getThirdwebDomains().rpc;
  const chain = {
    id: id,
    rpc: `https://${id}.${RPC_URL}`,
  } as const;
  return chain;
}

/**
 * @internal
 */
export function getCachedChainIfExists(id: number) {
  return CUSTOM_CHAIN_MAP.get(id);
}

function isLegacyChain(
  chain: ChainOptions | ViemChain | LegacyChain,
): chain is LegacyChain {
  return "rpc" in chain && Array.isArray(chain.rpc) && "slug" in chain;
}

/**
 * @internal
 */
export function convertLegacyChain(legacyChain: LegacyChain): Chain {
  const RPC_URL = getThirdwebDomains().rpc;
  return {
    blockExplorers: legacyChain?.explorers?.map((explorer) => ({
      apiUrl: explorer.url,
      name: explorer.name,
      url: explorer.url,
    })),
    faucets: legacyChain.faucets ? [...legacyChain.faucets] : undefined,
    icon: legacyChain.icon,
    id: legacyChain.chainId,
    name: legacyChain.name,
    nativeCurrency: {
      decimals: legacyChain.nativeCurrency.decimals,
      name: legacyChain.nativeCurrency.name,
      symbol: legacyChain.nativeCurrency.symbol,
    },
    rpc: legacyChain.rpc[0] ?? `https://${legacyChain.chainId}.${RPC_URL}`,
    testnet: legacyChain.testnet ? true : undefined,
  };
}

function isViemChain(
  chain: ChainOptions | ViemChain | LegacyChain,
): chain is ViemChain {
  return "rpcUrls" in chain && !("rpc" in chain);
}

/**
 * @internal
 */
export function convertViemChain(viemChain: ViemChain): Chain {
  const RPC_URL = getThirdwebDomains().rpc;
  return {
    blockExplorers: viemChain?.blockExplorers
      ? Object.values(viemChain?.blockExplorers).map((explorer) => {
          return {
            apiUrl: explorer.apiUrl,
            name: explorer.name,
            url: explorer.url,
          };
        })
      : [],
    id: viemChain.id,
    name: viemChain.name,
    nativeCurrency: {
      decimals: viemChain.nativeCurrency.decimals,
      name: viemChain.nativeCurrency.name,
      symbol: viemChain.nativeCurrency.symbol,
    },
    rpc:
      viemChain.rpcUrls.default.http[0] ?? `https://${viemChain.id}.${RPC_URL}`,
    testnet: viemChain.testnet ? true : undefined,
  };
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
 * @example
 * ```ts
 * import { getRpcUrlForChain } from "thirdweb/chains";
 * const rpcUrl = getRpcUrlForChain({ chain: 1, client });
 * console.log(rpcUrl); // "https://1.rpc.thirdweb.com/...
 * ```
 * @chain
 */
export function getRpcUrlForChain(options: GetRpcUrlForChainOptions): string {
  const baseRpcUrl = getThirdwebDomains().rpc;

  // if the chain is just a number, construct the RPC URL using the chain ID and client ID
  if (typeof options.chain === "number") {
    return `https://${options.chain}.${baseRpcUrl}/${options.client.clientId}`;
  }
  const { rpc } = options.chain;

  // add on the client ID to the RPC URL if it's a thirdweb URL
  if (isThirdwebUrl(rpc)) {
    const rpcUrl = new URL(
      options.chain.rpc.replace(DEFAULT_RPC_URL, baseRpcUrl),
    );
    if (rpcUrl.pathname === "/" || rpcUrl.pathname.startsWith("/$")) {
      rpcUrl.pathname = `/${options.client.clientId}`;
    }
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
    return getChainMetadata(chain)
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
    return getChainMetadata(chain)
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
    return getChainMetadata(chain)
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
      data: ChainMetadata;
      error?: never;
    }
  | {
      data?: never;
      error: unknown;
    };

/**
 * Retrieves chain data for a given chain.
 * @param chain - The chain object containing the chain ID.
 * @returns A Promise that resolves to the chain data.
 * @throws If there is an error fetching the chain data.
 * @example
 * ```ts
 * const chain = defineChain({ id: 1 });
 * const chainData = await getChainMetadata(chain);
 * console.log(chainData);
 * ```
 * @chain
 */
export function getChainMetadata(chain: Chain): Promise<ChainMetadata> {
  const chainId = chain.id;
  return withCache(
    async () => {
      try {
        const res = await fetch(
          `https://api.thirdweb.com/v1/chains/${chainId}`,
        );
        if (!res.ok) {
          throw new Error(
            `Failed to fetch chain data for chainId ${chainId}. ${res.status} ${res.statusText}`,
          );
        }

        const response = (await res.json()) as FetchChainResponse;
        if (response.error) {
          throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
        }
        if (!response.data) {
          throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
        }

        const data = response.data;

        return createChainMetadata(chain, data);
      } catch {
        return createChainMetadata(chain);
      }
    },
    {
      cacheKey: `chain:${chainId}`,
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

export async function getInsightEnabledChainIds(): Promise<number[]> {
  return withCache(
    async () => {
      const res = await fetch(
        `https://api.thirdweb.com/v1/chains/services?service=insight`,
      );
      if (!res.ok) {
        throw new Error(
          `Failed to fetch services. ${res.status} ${res.statusText}`,
        );
      }
      const response = (await res.json()) as { data: Record<number, boolean> };
      return Object.keys(response.data).map((chainId) => Number(chainId));
    },
    {
      cacheKey: `chain:insight-enabled`,
      cacheTime: 24 * 60 * 60 * 1000, // 1 day
    },
  );
}

/**
 * Convert `ApiChain` to `Chain` object
 * @internal
 */
export function convertApiChainToChain(apiChain: ChainMetadata): Chain {
  return {
    blockExplorers: apiChain.explorers?.map((explorer) => {
      return {
        apiUrl: explorer.url,
        name: explorer.name,
        url: explorer.url,
      };
    }),
    faucets: apiChain.faucets ? [...apiChain.faucets] : undefined,
    icon: apiChain.icon,
    id: apiChain.chainId,
    name: apiChain.name,
    nativeCurrency: apiChain.nativeCurrency,
    rpc: apiChain.rpc[0] || "",
    testnet: apiChain.testnet === true ? true : undefined,
  };
}

function createChainMetadata(
  chain: Chain,
  data?: ChainMetadata,
): ChainMetadata {
  const nativeCurrency = chain.nativeCurrency
    ? {
        ...data?.nativeCurrency,
        ...chain.nativeCurrency,
      }
    : data?.nativeCurrency;

  return {
    ...data,
    chain: data?.chain || chain.name || "",
    chainId: chain.id || data?.chainId || -1,
    explorers:
      chain.blockExplorers?.map((e) => ({
        name: e.name,
        standard: "EIP3091",
        url: e.url,
      })) || data?.explorers,
    icon: chain.icon || data?.icon,
    name: chain.name || data?.name || "",
    nativeCurrency: {
      decimals: nativeCurrency?.decimals || 18,
      name: nativeCurrency?.name || "",
      symbol: nativeCurrency?.symbol || "",
    },
    rpc: chain.rpc ? [chain.rpc] : data?.rpc || [""],
    shortName: data?.shortName || chain.name || "",
    slug: data?.slug || chain.name || "",
    stackType: data?.stackType || "",
    testnet: chain.testnet || data?.testnet || false,
  };
}
