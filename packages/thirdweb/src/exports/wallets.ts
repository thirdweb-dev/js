export {
  createWallet,
  smartWallet,
  inAppWallet,
  /**
   * @deprecated use inAppWallet instead
   */
  inAppWallet as embeddedWallet,
  walletConnect,
} from "../wallets/create-wallet.js";

export type { Wallet, Account } from "../wallets/interfaces/wallet.js";
export type { ConnectionStatus } from "../wallets/manager/index.js";

// utils
export {
  getWalletBalance,
  type GetWalletBalanceOptions,
} from "../wallets/utils/getWalletBalance.js";
export {
  generateAccount,
  type GenerateAccountOptions,
} from "../wallets/utils/generateAccount.js";

// private-key
export {
  privateKeyToAccount,
  /**
   * @internal
   * @deprecated - use {@link privateKeyToAccount} instead
   */
  privateKeyToAccount as privateKeyAccount,
  type PrivateKeyToAccountOptions,
  /**
   * @internal
   * @deprecated - use {@link PrivateKeyToAccountOptions} instead
   */
  type PrivateKeyToAccountOptions as PrivateKeyAccountOptions,
} from "../wallets/private-key.js";

// injected
export { injectedProvider } from "../wallets/injected/mipdStore.js";

export type {
  WalletId,
  InAppWalletCreationOptions,
  /**
   * @deprecated use InAppWalletCreationOptions instead
   */
  InAppWalletCreationOptions as EmbeddedWalletCreationOptions,
  WalletAutoConnectionOption,
  WalletCreationOptions,
  WalletConnectionOption,
  CreateWalletArgs,
} from "../wallets/wallet-types.js";

export type {
  WCSupportedWalletIds,
  InjectedSupportedWalletIds,
} from "../wallets/__generated__/wallet-ids.js";

export type {
  WCConnectOptions,
  WCAutoConnectOptions,
} from "../wallets/wallet-connect/types.js";

export type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
} from "../wallets/smart/types.js";

export type {
  InAppWalletAuth,
  /**
   * @deprecated use InAppWalletAuth instead
   */
  InAppWalletAuth as EmbeddedWalletAuth,
  InAppWalletAutoConnectOptions,
  /**
   * @deprecated use InAppWalletAutoConnectOptions instead
   */
  InAppWalletAutoConnectOptions as EmbeddedWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
  /**
   * @deprecated use InAppWalletConnectionOptions instead
   */
  InAppWalletConnectionOptions as EmbeddedWalletConnectionOptions,
  InAppWalletSocialAuth,
  /**
   * @deprecated use InAppWalletSocialAuth instead
   */
  InAppWalletSocialAuth as EmbeddedWalletSocialAuth,
} from "../wallets/in-app/core/wallet/index.js";

export type { CoinbaseSDKWalletConnectionOptions } from "../wallets/coinbase/coinbaseSDKWallet.js";

export type {
  WalletEmitter,
  WalletEmitterEvents,
} from "../wallets/wallet-emitter.js";

export { getAllWalletsList } from "../wallets/getAllWalletsList.js";
export { getWalletInfo } from "../wallets/__generated__/getWalletInfo.js";
