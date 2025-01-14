import type { Chain } from "../chains/types.js";
import { COINBASE, METAMASK, RAINBOW, ZERION } from "./constants.js";
import { createWallet } from "./create-wallet.js";
import type { Wallet } from "./interfaces/wallet.js";
import type { AppMetadata } from "./types.js";

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
    createWallet("io.rabby"),
    createWallet(ZERION),
  ];
}
