const chainIdNameMap = [
  { id: 1, label: "Ethereum", name: "ethereum" },
  { id: 137, label: "Polygon", name: "polygon" },
  { id: 42161, label: "Arbitrum", name: "arbitrum" },
  { id: 42170, label: "Arbitrum Nova", name: "arbitrum-nova" },
  { id: 43114, label: "Avalanche", name: "avalanche" },
  { id: 8453, label: "Base", name: "base" },
  { id: 81457, label: "Blast", name: "blast" },
  { id: 42220, label: "Celo", name: "celo" },
  { id: 6666666666, label: "Degen", name: "degen" },
  { id: 250, label: "Fantom", name: "fantom" },
  { id: 100, label: "Gnosis", name: "gnosis" },
  { id: 71402, label: "Godwoken", name: "godwoken" },
  { id: 13371, label: "Immutable zkEVM", name: "immutable-zkevm" },
  { id: 59144, label: "Linea", name: "linea" },
  { id: 5151706, label: "Loot", name: "loot" },
  { id: 169, label: "Manta", name: "manta" },
  { id: 1284, label: "Moonbeam", name: "moonbeam" },
  { id: 10, label: "Optimism", name: "optimism" },
  { id: 11297108109, label: "Palm", name: "palm" },
  { id: 1442, label: "Polygon zkEVM", name: "polygon-zkevm" },
  { id: 70700, label: "Proof of Play", name: "proof-of-play" },
  { id: 1380012617, label: "Rari", name: "rari" },
  { id: 534352, label: "Scroll", name: "scroll" },
  { id: 1329, label: "Sei", name: "sei" },
  { id: 660279, label: "Xai", name: "xai" },
  { id: 324, label: "zkSync Era", name: "zksync-era" },
  { id: 7777777, label: "Zora", name: "zora" },
  { id: 61166, label: "Treasure", name: "treasure" },
];

if (process.env.NEXT_PUBLIC_INCLUDE_TESTNETS) {
  chainIdNameMap.push({
    id: 11155111,
    label: "Ethereum Sepolia",
    name: "ethereum-sepolia",
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
