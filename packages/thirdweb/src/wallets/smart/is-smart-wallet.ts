import { isEcosystemWallet } from "../ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";

/**
 * Checks if the given wallet is a smart wallet.
 *
 * @param {Wallet} wallet - The wallet to check.
 * @returns {boolean} True if the wallet is a smart wallet, false otherwise.
 * @internal
 */
export function isSmartWallet(activeWallet?: Wallet): boolean {
  if (!activeWallet) {
    return false;
  }

  if (activeWallet.id === "smart") {
    return true;
  }

  if (activeWallet.id === "inApp" || isEcosystemWallet(activeWallet)) {
    const options = (activeWallet as Wallet<"inApp">).getConfig();
    if (options && "smartAccount" in options && options.smartAccount) {
      return true;
    }
    if (options?.executionMode) {
      const execMode = options.executionMode;
      return execMode.mode === "EIP4337" || execMode.mode === "EIP7702";
    }
  }
  return false;
}

/**
 * @internal
 */
export function hasSponsoredTransactionsEnabled(wallet: Wallet | undefined) {
  if (!wallet) {
    return false;
  }
  let sponsoredTransactionsEnabled = false;
  if (wallet && wallet.id === "smart") {
    const options = (wallet as Wallet<"smart">).getConfig();
    if ("sponsorGas" in options) {
      sponsoredTransactionsEnabled = options.sponsorGas;
    }
    if ("gasless" in options) {
      sponsoredTransactionsEnabled = options.gasless;
    }
  }
  if (wallet && (wallet.id === "inApp" || isEcosystemWallet(wallet))) {
    const options = (wallet as Wallet<"inApp">).getConfig();
    if (options && "smartAccount" in options && options.smartAccount) {
      const smartOptions = options.smartAccount;
      if ("sponsorGas" in smartOptions) {
        sponsoredTransactionsEnabled = smartOptions.sponsorGas;
      }
      if ("gasless" in smartOptions) {
        sponsoredTransactionsEnabled = smartOptions.gasless;
      }
    }
    if (options?.executionMode) {
      const execMode = options.executionMode;
      if (execMode.mode === "EIP4337") {
        const smartOptions = execMode.smartAccount;
        if (smartOptions && "sponsorGas" in smartOptions) {
          sponsoredTransactionsEnabled = smartOptions.sponsorGas;
        }
        if (smartOptions && "gasless" in smartOptions) {
          sponsoredTransactionsEnabled = smartOptions.gasless;
        }
      }
      if (execMode.mode === "EIP7702") {
        sponsoredTransactionsEnabled = execMode.sponsorGas || false;
      }
    }
  }
  return sponsoredTransactionsEnabled;
}
