import { coinbaseMetadata } from "../../coinbase/coinbaseMetadata.js";
import { InjectedWallet } from "../index.js";
import { injectedProvider } from "../mipdStore.js";

/**
 * Connect to Injected Coinbase Wallet Provider
 * @wallet
 * @example
 * ```ts
 * const wallet = coinbaseWallet();
 * ```
 * @returns The Wallet instance.
 */
export function coinbaseWallet() {
  return new InjectedWallet({
    walletId: coinbaseMetadata.id,
    metadata: coinbaseMetadata,
  });
}

/**
 * Get the injected Coinbase wallet provider
 * @example
 * ```ts
 * const provider = injectedCoinbaseProvider();
 * ```
 * @returns The injected coinbase wallet provider
 */
export function injectedCoinbaseProvider() {
  return injectedProvider(coinbaseMetadata.id);
}
