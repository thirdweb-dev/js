const chainIdNameMap = [
  { id: 1, name: "ethereum", label: "Ethereum" },
  { id: 137, name: "polygon", label: "Polygon" },
  { id: 42161, name: "arbitrum", label: "Arbitrum" },
  { id: 42170, name: "arbitrum-nova", label: "Arbitrum Nova" },
  { id: 43114, name: "avalanche", label: "Avalanche" },
  { id: 8453, name: "base", label: "Base" },
  { id: 81457, name: "blast", label: "Blast" },
  { id: 42220, name: "celo", label: "Celo" },
  { id: 6666666666, name: "degen", label: "Degen" },
  { id: 250, name: "fantom", label: "Fantom" },
  { id: 100, name: "gnosis", label: "Gnosis" },
  { id: 71402, name: "godwoken", label: "Godwoken" },
  { id: 13371, name: "immutable-zkevm", label: "Immutable zkEVM" },
  { id: 59144, name: "linea", label: "Linea" },
  { id: 5151706, name: "loot", label: "Loot" },
  { id: 169, name: "manta", label: "Manta" },
  { id: 1284, name: "moonbeam", label: "Moonbeam" },
  { id: 10, name: "optimism", label: "Optimism" },
  { id: 11297108109, name: "palm", label: "Palm" },
  { id: 1442, name: "polygon-zkevm", label: "Polygon zkEVM" },
  { id: 70700, name: "proof-of-play", label: "Proof of Play" },
  { id: 1380012617, name: "rari", label: "Rari" },
  { id: 534352, name: "scroll", label: "Scroll" },
  { id: 1329, name: "sei", label: "Sei" },
  { id: 660279, name: "xai", label: "Xai" },
  { id: 324, name: "zksync-era", label: "zkSync Era" },
  { id: 7777777, name: "zora", label: "Zora" },
  { id: 61166, name: "treasure", label: "Treasure" },
];

if (process.env.NEXT_PUBLIC_INCLUDE_TESTNETS) {
  chainIdNameMap.push({
    id: 11155111,
    name: "ethereum-sepolia",
    label: "Ethereum Sepolia",
  });
}

export const SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS = chainIdNameMap.map(
  (chain) => chain.id,
);

export function chainIdToName(chainId: number) {
  const chain = chainIdNameMap.find((chain) => chain.id === chainId);
  if (chain) {
    return chain.name;
  }

  throw new Error(`Unknown chain id: ${chainId}`);
}

export function nameToChainId(name: string) {
  const chain = chainIdNameMap.find((chain) => chain.name === name);
  if (chain) {
    return chain.id;
  }

  throw new Error(`Unknown chain name: ${name}`);
}
