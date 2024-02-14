export type {
  Wallet,
  Account,
  WalletWithPersonalWallet,
} from "./interfaces/wallet.js";
export type { WalletEventListener } from "./interfaces/listeners.js";
export type { WalletMetadata } from "./types.js";

export type { ConnectionStatus } from "./manager/index.js";
export { createConnectionManager } from "./manager/index.js";

export {
  getTokenBalance,
  type GetTokenBalanceOptions,
} from "./utils/getTokenBalance.js";

// private-key
export {
  privateKeyAccount,
  type PrivateKeyAccountOptions,
} from "./private-key.js";

// injected
export { injectedWallet } from "./injected/index.js";
export { getMIPDStore } from "./injected/mipdStore.js";

export type {
  WalletRDNS,
  InjectedWalletOptions,
  SpecificInjectedWalletOptions,
  InjectedWalletConnectOptions,
} from "./injected/types.js";
export { injectedProvider } from "./injected/mipdStore.js";

export {
  injectedMetamaskProvider,
  metamaskWallet,
  metamaskMetadata,
} from "./injected/wallets/metamask.js";

export {
  injectedCoinbaseProvider,
  coinbaseMetadata,
  coinbaseWallet,
} from "./injected/wallets/coinbase.js";

export {
  rainbowWallet,
  rainbowWalletMetadata,
  injectedRainbowProvider,
} from "./injected/wallets/rainbow.js";

export {
  zerionWallet,
  zerionWalletMetadata,
  injectedZerionProvider,
} from "./injected/wallets/zerion.js";

// wallet-connect
export {
  walletConnect,
  walletConnectMetadata,
} from "./wallet-connect/index.js";

export type { WalletConnectConnectionOptions } from "./wallet-connect/types.js";

// smart
export {
  smartWallet,
  SmartWallet,
  smartWalletMetadata,
  personalWalletToSmartAccountMap,
} from "./smart/index.js";
export type { SmartWalletOptions } from "./smart/types.js";

// storage
export {
  getSavedConnectParamsFromStorage,
  saveConnectParamsToStorage,
  deleteConnectParamsFromStorage,
} from "./manager/storage.js";
export type { WithPersonalWalletConnectionOptions } from "./manager/storage.js";

export {
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "./manager/index.js";
