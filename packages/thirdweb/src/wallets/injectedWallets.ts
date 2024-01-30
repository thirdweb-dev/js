import { injectedWallet } from "./injected.js";

export type SpecificInjectedWalletOptions = {
  chainId?: bigint | number;
};

/**
 * Connect to Injected Metamask Wallet Provider
 * @param options - The options for connecting to the Injected MetaMask Wallet Provider.
 * @example
 * ```ts
 * const wallet = await metamaskWallet();
 * ```
 * @returns A Promise that resolves to a Wallet instance.
 */
export function metamaskWallet(options?: SpecificInjectedWalletOptions) {
  return injectedWallet({
    walletId: "io.metamask",
    chainId: options?.chainId,
  });
}

/**
 * Connect to Injected Rainbow Wallet Provider
 * @param options - The options for connecting to the Injected MetaMask Wallet Provider.
 * @example
 * ```ts
 * const wallet = await rainbowWallet();
 * ```
 * @returns A Promise that resolves to a Wallet instance.
 */
export function rainbowWallet(options?: SpecificInjectedWalletOptions) {
  return injectedWallet({
    walletId: "me.rainbow",
    chainId: options?.chainId,
  });
}

/**
 * Connect to Injected Zerion Wallet Provider
 * @param options - The options for connecting to the Injected MetaMask Wallet Provider.
 * @example
 * ```ts
 * const wallet = await zerionWallet();
 * ```
 * @returns A Promise that resolves to a Wallet instance.
 */
export function zerionWallet(options?: SpecificInjectedWalletOptions) {
  return injectedWallet({
    walletId: "io.zerion.wallet",
    chainId: options?.chainId,
  });
}
