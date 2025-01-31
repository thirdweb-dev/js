import type { Wallet } from "../interfaces/wallet.js";
import type { SmartWalletOptions } from "./types.js";

/**
 * Gets the smart wallet configuration for a given wallet.
 *
 * @param {Wallet} wallet - The wallet to check.
 * @returns {SmartWalletOptions} The smart wallet configuration.
 *
 * @throws {Error} If the wallet is not a smart wallet.
 * @internal
 */
export function getSmartWallet(wallet: Wallet): SmartWalletOptions {
  if (wallet.id === "smart") {
    return (wallet as Wallet<"smart">).getConfig();
  }

  const config = wallet.getConfig();
  if (!!config && "smartAccount" in config && !!config?.smartAccount) {
    return config.smartAccount;
  }

  throw new Error("Wallet is not a smart wallet");
}
