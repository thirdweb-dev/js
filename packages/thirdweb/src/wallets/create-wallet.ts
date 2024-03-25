/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import type { Wallet } from "./interfaces/wallet.js";

// todo - auto generate
export type WalletId = "metamask" | "coinbase" | "rainbow";

type WalletConfigMap = {
  metamask: "foo";
  coinbase?: "bar";
};

type NonOptionalKeysOfMap<T> = Exclude<
  {
    [K in keyof T]: undefined extends T[K] ? never : K;
  }[keyof T],
  undefined
>;

type WalletIdsThatRequireOptions = NonOptionalKeysOfMap<WalletConfigMap>;
type WalletIdsThatDoNotRequireOptions = Exclude<
  WalletId,
  WalletIdsThatRequireOptions
>;

export function createWallet<
  const TWalletId extends WalletIdsThatRequireOptions,
  const TWalletConfig = WalletConfigMap[TWalletId],
>(walletId: TWalletId, walletConfig: TWalletConfig): Wallet;
export function createWallet<
  const TWalletId extends WalletIdsThatDoNotRequireOptions,
  const TWalletConfig = TWalletId extends keyof WalletConfigMap
    ? WalletConfigMap[TWalletId]
    : never,
>(walletId: TWalletId, walletConfig?: TWalletConfig): Wallet;

/**
 * Creates a wallet based on the provided walletId and options.
 * @template TWalletId - The type of the walletId.
 * @template TWalletConfig - The type of the options.
 * @param walletId - The walletId to create the wallet for.
 * @param walletConfig - The options to configure the wallet (optional).
 * @returns The created wallet.
 * @example
 * ```ts
 * import { createWallet } from "thirdweb/wallets";
 * const wallet = createWallet("metamask", "foo");
 * ```
 */
export function createWallet<
  const TWalletId extends WalletId,
  const TWalletConfig = TWalletId extends keyof WalletConfigMap
    ? WalletConfigMap[TWalletId]
    : undefined,
>(walletId: TWalletId, walletConfig: TWalletConfig): Wallet {
  console.log(walletId, walletConfig);
  return null as unknown as Wallet;
}

// testing the type

// createWallet("metamask", "foo");
// createWallet("coinbase", "bar");
// createWallet("coinbase");
// createWallet("rainbow");
