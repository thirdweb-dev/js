import { Chain } from "@thirdweb-dev/chains";
import { Chain as WagmiChain } from "wagmi";

export function transformChainToMinimalWagmiChain(chain: Chain): WagmiChain {
  return {
    id: chain.chainId,
    name: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals as 18,
    },
    testnet: chain.testnet,
    rpcUrls: chain.rpc as string[],
    blockExplorers: chain.explorers?.map((explorer) => ({
      name: explorer.name,
      url: explorer.url,
    })),
  };
}
