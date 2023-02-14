// do not import anything else here
// this file will be imported in the middleware and it can not handle all imports

export type DashboardSolanaNetwork =
  keyof typeof SupportedSolanaNetworkToUrlMap;

export const SupportedSolanaNetworkToUrlMap = {
  "mainnet-beta": "solana",
  devnet: "sol-devnet",
} as const;

export const SupportedSolanaUrlToNetworkMap = {
  solana: "mainnet-beta",
  "sol-devnet": "devnet",
} as const;

export function getSolNetworkFromNetworkPath(
  network?: string,
): DashboardSolanaNetwork | undefined {
  if (isSupportedSOLNetwork(network)) {
    return SupportedSolanaUrlToNetworkMap[network];
  }
  return undefined;
}

export type SupportedSolNetwork = keyof typeof SupportedSolanaUrlToNetworkMap;

export function isSupportedSOLNetwork(
  network?: string,
): network is keyof typeof SupportedSolanaUrlToNetworkMap {
  return network ? network in SupportedSolanaUrlToNetworkMap : false;
}

export type DashboardChainIdMode = "evm" | "solana" | "both";
