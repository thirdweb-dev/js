import { type Chain, defineChain } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";

export function mapV4ChainToV5Chain(v4Chain: ChainMetadata) {
  const chain: Chain = {
    // TypeScript shenanigans, just avoiding as string assertion here
    blockExplorers: v4Chain.explorers?.map((x) => x),
    // TypeScript shenanigans, just avoiding as string assertion here
    faucets: v4Chain.faucets?.map((x) => x),
    icon: v4Chain.icon,
    id: v4Chain.chainId,
    name: v4Chain.name,
    nativeCurrency: v4Chain.nativeCurrency,
    // eslint-disable-next-line no-restricted-syntax
    rpc: v4Chain.rpc[0] || defineChain(v4Chain.chainId).rpc,
    testnet: v4Chain.testnet === true ? true : undefined,
  };

  return chain;
}
