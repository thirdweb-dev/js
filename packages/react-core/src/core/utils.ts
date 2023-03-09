import { DEFAULT_API_KEY } from "./constants/rpc";
import { __DEV__ } from "./constants/runtime";
import { Chain, getChainRPC } from "@thirdweb-dev/chains";
import { Chain as WagmiChain } from "@wagmi/core";

const warnSet = new Set<`${string}:${string}`>();

export function showDeprecationWarning(
  deprecated: string,
  replacement: string,
) {
  // deprecation warnings only in dev only in dev
  if (__DEV__) {
    if (warnSet.has(`${deprecated}:${replacement}`)) {
      return;
    }
    warnSet.add(`${deprecated}:${replacement}`);
    console.warn(
      `\`${deprecated}\` is deprecated and will be removed in a future major version. Please use \`${replacement}\` instead.`,
    );
  }
}

export function transformChainToMinimalWagmiChain(chain: Chain): WagmiChain {
  const rpc = getChainRPC(chain, {
    thirdwebApiKey: DEFAULT_API_KEY,
  });

  return {
    id: chain.chainId,
    name: chain.name,
    network: chain.slug,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals as 18,
    },
    testnet: chain.testnet,
    rpcUrls: {
      default: {
        http: [rpc],
      },
      public: {
        http: [rpc],
      },
    },
    blockExplorers: chain.explorers?.reduce(
      (
        prev,
        explorer: {
          name: string;
          url: string;
          standard: string;
        },
      ) => {
        return {
          ...prev,
          [explorer.name]: {
            name: explorer.name,
            url: explorer.url,
          },
        };
      },
      {
        default: { name: chain.explorers[0].name, url: chain.explorers[0].url },
      },
    ),
  };
}

// it rejects the promise if the given promise does not resolve within the given time
export const timeoutPromise = <T>(
  ms: number,
  promise: Promise<T>,
  errorMessage: string,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
    promise.then(resolve, reject);
  });
};
