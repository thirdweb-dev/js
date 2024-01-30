import { injectedWallet, type InjectedWalletOptions } from "./injected.js";

export type SpecificInjectedWalletOptions = Omit<
  InjectedWalletOptions,
  "walletId"
>;

/**
 * Connect to Injected Metamask Wallet Provider
 * @param options - The options for connecting to the Injected MetaMask Wallet Provider.
 * @example
 * ```ts
 * const wallet = await metamaskWallet();
 * ```
 * @returns A Promise that resolves to a Wallet instance.
 */
export async function metamaskWallet(options?: SpecificInjectedWalletOptions) {
  const wallet = await injectedWallet({
    ...options,
    walletId: "io.metamask",
  });
  wallet.id = "metamask";
  return wallet;
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
export async function rainbowWallet(options?: SpecificInjectedWalletOptions) {
  const wallet = await injectedWallet({
    ...options,
    walletId: "me.rainbow",
  });
  wallet.id = "rainbow";
  return wallet;
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
export async function zerionWallet(options?: SpecificInjectedWalletOptions) {
  const wallet = await injectedWallet({
    ...options,
    walletId: "io.zerion.wallet",
  });
  wallet.id = "zerion";
  return wallet;
}
