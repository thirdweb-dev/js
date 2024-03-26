/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import type { WalletConfigMap, WalletId } from "./__generated__/wallet-ids.js";
import type { Prettify } from "../utils/type-utils.js";
import { Wallet } from "./interfaces/wallet.js";

// all keys of the WalletConfigMap where the config is required
type WalletsRequiresConfig = Prettify<{
  [K in keyof WalletConfigMap]: [WalletConfigMap[K]["config"]] extends [never]
    ? false
    : true;
}>;

type WalletIdsThatRequireConfig = Prettify<
  {
    [K in keyof WalletsRequiresConfig]: WalletsRequiresConfig[K] extends true
      ? K
      : never;
  }[keyof WalletsRequiresConfig]
>;

type WalletIdsThatDoNotRequireConfig = Exclude<
  WalletId,
  WalletIdsThatRequireConfig
>;

export function createWallet<
  const TWalletId extends WalletIdsThatRequireConfig,
  const TWalletConfig = WalletConfigMap[TWalletId]["config"],
>(walletId: TWalletId, walletConfig: TWalletConfig): Wallet<TWalletId>;
export function createWallet<
  const TWalletId extends WalletIdsThatDoNotRequireConfig,
  const TWalletConfig = TWalletId extends keyof WalletConfigMap
    ? WalletConfigMap[TWalletId]["config"]
    : never,
>(walletId: TWalletId, walletConfig?: TWalletConfig): Wallet<TWalletId>;

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
>(walletId: TWalletId, walletConfig: TWalletConfig): Wallet<TWalletId> {
  return new Wallet(walletId, walletConfig) as Wallet<TWalletId>;
}
