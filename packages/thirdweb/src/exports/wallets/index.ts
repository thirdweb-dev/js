export type {
  Wallet,
  Account,
  WalletWithPersonalWallet,
} from "../../wallets/interfaces/wallet.js";
export type { WalletEventListener } from "../../wallets/interfaces/listeners.js";
export type { WalletMetadata } from "../../wallets/types.js";

export type { ConnectionStatus } from "../../wallets/manager/index.js";

export {
  getTokenBalance,
  type GetTokenBalanceOptions,
} from "../../wallets/utils/getTokenBalance.js";

// private-key
export {
  privateKeyAccount,
  type PrivateKeyAccountOptions,
} from "../../wallets/private-key.js";

// injected
export { injectedWallet } from "../../wallets/injected/index.js";

export type {
  WalletRDNS,
  InjectedWalletOptions,
  InjectedWalletConnectOptions,
} from "../../wallets/injected/types.js";
export { injectedProvider } from "../../wallets/injected/mipdStore.js";

export {
  injectedMetamaskProvider,
  metamaskWallet,
} from "../../wallets/injected/wallets/metamask.js";

export {
  injectedCoinbaseProvider,
  coinbaseWallet,
} from "../../wallets/injected/wallets/coinbase.js";

export {
  rainbowWallet,
  injectedRainbowProvider,
} from "../../wallets/injected/wallets/rainbow.js";

export {
  zerionWallet,
  injectedZerionProvider,
} from "../../wallets/injected/wallets/zerion.js";

// wallet-connect
export { walletConnect } from "../../wallets/wallet-connect/index.js";

export type { WalletConnectConnectionOptions } from "../../wallets/wallet-connect/types.js";

// smart
export { smartWallet } from "../../wallets/smart/index.js";
export type { SmartWalletOptions } from "../../wallets/smart/types.js";

export type { WithPersonalWalletConnectionOptions } from "../../wallets/manager/storage.js";

export {
  coinbaseSDKWallet,
  type CoinbaseSDKWalletConnectionOptions,
} from "../../wallets/coinbase/coinbaseSDKWallet.js";
