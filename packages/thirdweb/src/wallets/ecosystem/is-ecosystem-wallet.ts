/**
 * Checks if the given wallet is an ecosystem wallet.
 *
 * @param {string} walletId - The wallet ID to check.
 * @returns {boolean} True if the wallet is an ecosystem wallet, false otherwise.
 * @internal
 */
export function isEcosystemWallet(walletId: string): boolean {
  return walletId.startsWith("ecosystem.");
}
