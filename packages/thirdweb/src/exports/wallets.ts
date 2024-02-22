export type {
  Wallet,
  Account,
  WalletWithPersonalWallet,
} from "../wallets/interfaces/wallet.js";
export type { WalletEventListener } from "../wallets/interfaces/listeners.js";
export type { WalletMetadata } from "../wallets/types.js";

export type { ConnectionStatus } from "../wallets/manager/index.js";
export { createConnectionManager } from "../wallets/manager/index.js";

export {
  getTokenBalance,
  type GetTokenBalanceOptions,
} from "../wallets/utils/getTokenBalance.js";

// private-key
export {
  privateKeyAccount,
  type PrivateKeyAccountOptions,
} from "../wallets/private-key.js";

// injected
export {
  injectedWallet,
  type InjectedWallet,
} from "../wallets/injected/index.js";
export { getMIPDStore } from "../wallets/injected/mipdStore.js";

export type {
  WalletRDNS,
  InjectedWalletOptions,
  InjectedWalletConnectOptions,
} from "../wallets/injected/types.js";
export { injectedProvider } from "../wallets/injected/mipdStore.js";

export {
  injectedMetamaskProvider,
  metamaskWallet,
} from "../wallets/injected/wallets/metamask.js";

export {
  injectedCoinbaseProvider,
  coinbaseWallet,
} from "../wallets/injected/wallets/coinbase.js";

export {
  rainbowWallet,
  injectedRainbowProvider,
} from "../wallets/injected/wallets/rainbow.js";

export {
  zerionWallet,
  injectedZerionProvider,
} from "../wallets/injected/wallets/zerion.js";

// wallet-connect
export {
  walletConnect,
  type WalletConnect,
} from "../wallets/wallet-connect/index.js";

export type {
  WalletConnectConnectionOptions,
  WalletConnectCreationOptions,
} from "../wallets/wallet-connect/types.js";

// smart
export { smartWallet, type SmartWallet } from "../wallets/smart/index.js";
export type {
  SmartWalletOptions,
  SmartWalletConnectionOptions,
} from "../wallets/smart/types.js";

// storage
export {
  getSavedConnectParamsFromStorage,
  saveConnectParamsToStorage,
  deleteConnectParamsFromStorage,
} from "../wallets/manager/storage.js";
export type { WithPersonalWalletConnectionOptions } from "../wallets/manager/storage.js";

export {
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../wallets/manager/index.js";

export {
  coinbaseSDKWallet,
  type CoinbaseSDKWalletOptions,
  type CoinbaseSDKWalletConnectionOptions,
  type CoinbaseSDKWallet,
} from "../wallets/coinbase/coinbaseSDKWallet.js";

export { embeddedWallet } from "../wallets/embedded/core/wallet/index.js";
export {
  type MultiStepAuthArgsType,
  type SingleStepAuthArgsType,
} from "../wallets/embedded/core/authentication/type.js";
