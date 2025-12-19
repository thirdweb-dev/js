import type { Chain } from "../chains/types.js";
import { COINBASE, METAMASK, RAINBOW, ZERION } from "./constants.js";
import { createWallet } from "./create-wallet.js";
import type { ExecutionModeOptions } from "./in-app/core/wallet/types.js";
import type { Wallet } from "./interfaces/wallet.js";
import type { AppMetadata } from "./types.js";

/**
 * @internal
 */
export function getDefaultWallets(options?: {
  appMetadata?: AppMetadata;
  chains?: Chain[];
  executionMode?: ExecutionModeOptions;
}): Wallet[] {
  return [
    createWallet("inApp", {
      executionMode: options?.executionMode,
    }),
    createWallet(METAMASK),
    createWallet(COINBASE, {
      appMetadata: options?.appMetadata,
      chains: options?.chains,
    }),
    createWallet(RAINBOW),
    createWallet("io.rabby"),
    createWallet(ZERION),
    createWallet("com.okex.wallet"),
  ];
}

/**
 * @internal
 */
export function getDefaultWalletsForBridgeComponents(options?: {
  appMetadata?: AppMetadata;
  chains?: Chain[];
  executionMode?: ExecutionModeOptions;
}): Wallet[] {
  return [
    createWallet(METAMASK),
    createWallet(COINBASE, {
      appMetadata: options?.appMetadata,
      chains: options?.chains,
    }),
    createWallet(RAINBOW),
    createWallet("io.rabby"),
    createWallet(ZERION),
    createWallet("com.okex.wallet"),
  ];
}
