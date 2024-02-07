import { InjectedWallet } from "../index.js";
import { injectedProvider } from "../mipdStore.js";
import type { SpecificInjectedWalletOptions } from "../types.js";

export const zerionWalletMetadata = {
  id: "io.zerion.wallet",
  name: "Zerion Wallet",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMyMzYxRUMiLz4KPHBhdGggZD0iTTE3LjM3OSAyMEMxNi4wMDggMjAgMTUuNDc5OCAyMS42OTUyIDE2LjYzMDEgMjIuNDAzNEw0NS40MDk0IDM5Ljc1NjJDNDYuMTI2OCA0MC4xOTc4IDQ3LjA4MzUgNDAuMDIzNCA0Ny41Nzc0IDM5LjM2MDhMNjAuMjMwOSAyMi43NDlDNjEuMDkxMiAyMS41OTUgNjAuMjIyIDIwIDU4LjczMjkgMjBIMTcuMzc5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYyLjYxMTcgNjAuMDAwMUM2My45ODI3IDYwLjAwMDEgNjQuNTI0NSA1OC4yOTU1IDYzLjM3NDMgNTcuNTg3NUwzNC41ODY4IDQwLjIzNjlDMzMuODY5NCAzOS43OTUzIDMyLjkzNTkgMzkuOTkxOSAzMi40NDIxIDQwLjY1NDNMMTkuNzY0IDU3LjI2MjlDMTguOTAzOSA1OC40MTY3IDE5LjgwMDMgNjAuMDAwMSAyMS4yODkyIDYwLjAwMDFINjIuNjExN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
};

/**
 * Connect to Injected Zerion Wallet Provider
 * @param options - The options for connecting to the Injected MetaMask Wallet Provider.
 * @wallet
 * @example
 * ```ts
 * const wallet = zerionWallet();
 * ```
 * @returns The Wallet instance.
 */
export function zerionWallet(options?: SpecificInjectedWalletOptions) {
  return new InjectedWallet({
    ...options,
    walletId: zerionWalletMetadata.id,
    metadata: zerionWalletMetadata,
  });
}

/**
 * Get the injected Zerion provider
 * @example
 * ```ts
 * const provider = injectedZerionProvider();
 * ```
 * @returns The injected Metamask provider
 */
export function injectedZerionProvider() {
  return injectedProvider(zerionWalletMetadata.id);
}
