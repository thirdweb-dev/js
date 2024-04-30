import type { Chain } from "../../../chains/types.js";
import { createWallet } from "../../../wallets/create-wallet.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { AppMetadata } from "../../../wallets/types.js";

/**
 * @internal
 */
export function getDefaultWallets(options?: {
  appMetadata?: AppMetadata;
  chains?: Chain[];
}): Wallet[] {
  return [
    createWallet("inApp"),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet", {
      appMetadata: options?.appMetadata,
      chains: options?.chains,
    }),
    createWallet("me.rainbow"),
    createWallet("io.zerion.wallet"),
  ];
}
