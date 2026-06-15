import type { Chain } from "../chains/types.js";
import { createEmitter, type Emitter } from "../utils/tiny-emitter.js";
import type { Account } from "./interfaces/wallet.js";
import type { WalletAutoConnectionOption, WalletId } from "./wallet-types.js";

/**
 * The error payload passed to `disconnect` subscribers when the underlying
 * EIP-1193 provider fires a disconnect event with an error code.
 * `code` follows the EIP-1193 provider error table (e.g. 1013 = transient).
 */
export type WalletDisconnectError = {
  code?: number;
  message?: string;
};

export type WalletEmitterEvents<TWalletId extends WalletId> = {
  accountChanged: Account;
  accountsChanged: string[];
  /** Fired when the wallet is permanently disconnected. The optional `error`
   *  payload contains the EIP-1193 provider error (code + message) that
   *  triggered the disconnect, when one is available. */
  disconnect: WalletDisconnectError | undefined;
  chainChanged: Chain;
  onConnect: WalletAutoConnectionOption<TWalletId>;
};

export type WalletEmitter<TWalletId extends WalletId> = Emitter<
  WalletEmitterEvents<TWalletId>
>;

/**

 * @internal
 */
export function createWalletEmitter<const TWalletId extends WalletId>() {
  return createEmitter<WalletEmitterEvents<TWalletId>>();
}
