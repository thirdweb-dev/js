import type { Chain } from "../../../chains/types.js";
import {
  COINBASE,
  METAMASK,
  RAINBOW,
  ZERION,
} from "../../../wallets/constants.js";
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
    createWallet(METAMASK),
    createWallet(COINBASE, {
      appMetadata: options?.appMetadata,
      chains: options?.chains,
    }),
    createWallet(RAINBOW),
    createWallet(ZERION),
  ];
}
