import type { Chain } from "thirdweb";
import type { StoredChain } from "./configured-chains";

export function mapV4ChainToV5Chain(v4Chain: StoredChain) {
  const chain: Chain = {
    id: v4Chain.chainId,
    rpc: v4Chain.rpc[0],
    // TypeScript shenanigans, just avoiding as string assertion here
    blockExplorers: v4Chain.explorers?.map((x) => x),
    // TypeScript shenanigans, just avoiding as string assertion here
    faucets: v4Chain.faucets?.map((x) => x),
    name: v4Chain.name,
    icon: v4Chain.icon,
    testnet: v4Chain.testnet === true ? true : undefined,
    nativeCurrency: v4Chain.nativeCurrency,
  };

  return chain;
}
