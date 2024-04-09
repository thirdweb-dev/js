import { createWallet } from "../../../wallets/create-wallet.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";

/**
 * @internal
 */
export function getDefaultWallets(): Wallet[] {
  return [
    createWallet("inApp"),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.zerion.wallet"),
  ];
}
