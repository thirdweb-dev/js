import type { Chain } from "../chains/types.js";
import { createEmitter, type Emitter } from "../utils/tiny-emitter.js";
import type { WalletAutoConnectionOption, WalletId } from "./wallet-types.js";

type WalletEmitterEvents<TWalletId extends WalletId> = {
  accountsChanged: string[];
  disconnect?: never;
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
