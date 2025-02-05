import type { Wallet } from "../interfaces/wallet.js";

/**
 * Checks if the given wallet is a smart wallet.
 *
 * @param {Wallet} wallet - The wallet to check.
 * @returns {boolean} True if the wallet is a smart wallet, false otherwise.
 * @internal
 */
export function isSmartWallet(wallet: Wallet): boolean {
  if (wallet.id === "smart") {
    return true;
  }

  const config = wallet.getConfig();
  if (!!config && "smartAccount" in config && !!config.smartAccount) {
    return true;
  }

  return false;
}
