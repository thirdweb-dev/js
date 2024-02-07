import type { WalletMetadata } from "../../types.js";
import { InjectedWallet } from "../index.js";
import { injectedProvider } from "../mipdStore.js";
import type { SpecificInjectedWalletOptions } from "../types.js";

export const coinbaseMetadata: WalletMetadata = {
  id: "com.coinbase.wallet",
  name: "Coinbase Wallet",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzA1NTVGRiIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMzMwM184NjM0KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMzMxMiA0SDM1LjY2NzJDNDAuMjcwNCA0IDQ0IDguMDEyOCA0NCAxMi45NjMyVjM1LjAzNjhDNDQgMzkuOTg3MiA0MC4yNzA0IDQ0IDM1LjY2ODggNDRIMTIuMzMxMkM3LjcyOTYgNDQgNCAzOS45ODcyIDQgMzUuMDM2OFYxMi45NjMyQzQgOC4wMTI4IDcuNzI5NiA0IDEyLjMzMTIgNFoiIGZpbGw9IiMwMDUyRkYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNC4wMDAzIDkuNzkzNDZDMzEuODQ2NyA5Ljc5MzQ2IDM4LjIwNjcgMTYuMTUzNSAzOC4yMDY3IDIzLjk5OTlDMzguMjA2NyAzMS44NDYzIDMxLjg0NjcgMzguMjA2MyAyNC4wMDAzIDM4LjIwNjNDMTYuMTUzOSAzOC4yMDYzIDkuNzkzOTUgMzEuODQ2MyA5Ljc5Mzk1IDIzLjk5OTlDOS43OTM5NSAxNi4xNTM1IDE2LjE1MzkgOS43OTM0NiAyNC4wMDAzIDkuNzkzNDZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIwLjUwMDYgMTkuNDU5SDI3LjQ5NzRDMjguMDczNCAxOS40NTkgMjguNTM5IDE5Ljk2MTQgMjguNTM5IDIwLjU3OVYyNy40MTlDMjguNTM5IDI4LjAzODIgMjguMDcxOCAyOC41MzkgMjcuNDk3NCAyOC41MzlIMjAuNTAwNkMxOS45MjQ2IDI4LjUzOSAxOS40NTkgMjguMDM2NiAxOS40NTkgMjcuNDE5VjIwLjU3OUMxOS40NTkgMTkuOTYxNCAxOS45MjYyIDE5LjQ1OSAyMC41MDA2IDE5LjQ1OVoiIGZpbGw9IiMwMDUyRkYiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMzAzXzg2MzQiPgo8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDQpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
};

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
