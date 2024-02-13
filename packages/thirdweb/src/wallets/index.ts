export type { Wallet } from "./interfaces/wallet.js";
export { createConnectionManager } from "./manager/index.js";

export {
  getTokenBalance,
  type GetTokenBalanceOptions,
} from "./utils/getTokenBalance.js";

// private-key
export {
  privateKeyAccount,
  type PrivateKeyAccountOptions as PrivateKeyWalletOptions,
} from "./private-key.js";

// injected
export { injectedWallet } from "./injected/index.js";
export { getMIPDStore } from "./injected/mipdStore.js";

export type {
  WalletRDNS,
  InjectedWalletOptions,
  SpecificInjectedWalletOptions,
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
export { smartWallet } from "./smart/index.js";
