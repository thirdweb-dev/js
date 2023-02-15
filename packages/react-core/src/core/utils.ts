import { __DEV__ } from "./constants/rpc";
import { Chain } from "@thirdweb-dev/chains";
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
        http: chain.rpc as string[],
      },
      public: {
        http: chain.rpc as string[],
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
