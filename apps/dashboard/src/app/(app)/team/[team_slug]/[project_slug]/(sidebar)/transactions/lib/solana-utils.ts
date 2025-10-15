/**
 * Get the Solscan explorer URL for a given transaction signature and chain ID
 * @param signature - The transaction signature
 * @param chainId - The chain ID in format "solana:mainnet", "solana:devnet", or "solana:testnet"
 * @returns The Solscan URL for the transaction
 */
export function getSolscanUrl(signature: string, chainId: string): string {
  const network = chainId.split(":")[1] || "mainnet";

  // Solscan uses different subdomains for different networks
  switch (network.toLowerCase()) {
    case "devnet":
      return `https://solscan.io/tx/${signature}?cluster=devnet`;
    case "testnet":
      return `https://solscan.io/tx/${signature}?cluster=testnet`;
    default:
      return `https://solscan.io/tx/${signature}`;
  }
}

/**
 * Get the display network name from a Solana chain ID (capitalized)
 * @param chainId - The chain ID in format "solana:mainnet", "solana:devnet", or "solana:testnet"
 * @returns The capitalized network name for display (e.g., "Devnet")
 */
export function getSolanaNetworkName(chainId: string): string {
  const network = chainId.split(":")[1] || "mainnet";
  return network.charAt(0).toUpperCase() + network.slice(1);
}
