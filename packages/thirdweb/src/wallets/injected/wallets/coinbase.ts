import { coinbaseMetadata } from "../../coinbase/coinbaseMetadata.js";
import { InjectedWallet } from "../index.js";
import { injectedProvider } from "../mipdStore.js";
import type { SpecificInjectedWalletOptions } from "../types.js";

/**
 * Connect to Injected Coinbase Wallet Provider
 * @param options - The options for connecting to the Injected Coinbase Wallet Provider.
 * @wallet
 * @example
 * ```ts
 * const wallet = coinbaseWallet();
 * ```
 * @returns The Wallet instance.
 */
export function coinbaseWallet(options?: SpecificInjectedWalletOptions) {
  return new InjectedWallet({
    ...options,
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
