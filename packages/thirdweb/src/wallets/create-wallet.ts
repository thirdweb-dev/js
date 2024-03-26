import type { WalletId, CreateWalletArgs } from "./wallet-types.js";
import { Wallet } from "./interfaces/wallet.js";

// TODO: figure out how to define the type without tuple args type and using function overloads

/**
 * Creates a wallet based on the provided walletId and options.
 * @param args - The walletId and options to create the wallet.
 * @example
 * ```ts
 * import { createWallet } from "thirdweb/wallets";
 * ```
 * @returns The created wallet.
 */
export function createWallet<ID extends WalletId>(
  ...args: CreateWalletArgs<ID>
): Wallet<ID> {
  return new Wallet(...args);
}
