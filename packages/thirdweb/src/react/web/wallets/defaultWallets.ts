import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { createWallet } from "../../../wallets/create-wallet.js";

/**
 * @internal
 */
export function getDefaultWallets(): Wallet[] {
  return [
    createWallet("io.metamask", {}),
    createWallet("com.coinbase.wallet", {}),
    createWallet("me.rainbow", {}),
    createWallet("io.zerion.wallet", {}),
  ];
}
