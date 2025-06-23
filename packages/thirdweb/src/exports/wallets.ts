// --- KEEEP IN SYNC with exports/wallets.native.ts ---

// generate a random private key
export { randomPrivateKey } from "ox/Secp256k1";
// eip1193
export * as EIP1193 from "../adapters/eip1193/index.js";
export type { AdapterWalletOptions } from "../adapters/wallet-adapter.js";
export { createWalletAdapter } from "../adapters/wallet-adapter.js";
export { getWalletInfo } from "../wallets/__generated__/getWalletInfo.js";
export type {
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "../wallets/__generated__/wallet-ids.js";
export type {
  CoinbaseSDKWalletConnectionOptions,
  CoinbaseWalletCreationOptions,
} from "../wallets/coinbase/coinbase-web.js";
export {
  createWallet,
  walletConnect,
} from "../wallets/create-wallet.js";
export type {
  EcosystemWalletAutoConnectOptions,
  EcosystemWalletConnectionOptions,
  EcosystemWalletCreationOptions,
} from "../wallets/ecosystem/types.js";
export { getAllWalletsList } from "../wallets/getAllWalletsList.js";
export type {
  MultiStepAuthArgsType,
  Profile,
  SingleStepAuthArgsType,
} from "../wallets/in-app/core/authentication/types.js";
export {
  type GetUserResult,
  getUser,
} from "../wallets/in-app/core/users/getUser.js";
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
  InAppWalletCreationOptions,
  InAppWalletSocialAuth,
  /**
   * @deprecated use InAppWalletSocialAuth instead
   */
  InAppWalletSocialAuth as EmbeddedWalletSocialAuth,
  WalletUser,
} from "../wallets/in-app/core/wallet/types.js";
export { ecosystemWallet } from "../wallets/in-app/web/ecosystem.js";
export {
  inAppWallet,
  /**
   * @deprecated use inAppWallet instead
   */
  inAppWallet as embeddedWallet,
} from "../wallets/in-app/web/in-app.js";
export {
  authenticate,
  authenticateWithRedirect,
  getProfiles,
  getUserEmail,
  getUserPhoneNumber,
  linkProfile,
  preAuthenticate,
  unlinkProfile,
} from "../wallets/in-app/web/lib/auth/index.js";
export type { Account, Wallet } from "../wallets/interfaces/wallet.js";
export type { ConnectionStatus } from "../wallets/manager/index.js";
// private-key
export {
  type PrivateKeyToAccountOptions,
  /**
   * @internal
   * @deprecated - use {@link PrivateKeyToAccountOptions} instead
   */
  type PrivateKeyToAccountOptions as PrivateKeyAccountOptions,
  privateKeyToAccount,
  /**
   * @internal
   * @deprecated - use {@link privateKeyToAccount} instead
   */
  privateKeyToAccount as privateKeyAccount,
} from "../wallets/private-key.js";
export { smartWallet } from "../wallets/smart/smart-wallet.js";
export type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
} from "../wallets/smart/types.js";
export {
  type GenerateAccountOptions,
  generateAccount,
} from "../wallets/utils/generateAccount.js";
// utils
export {
  type GetWalletBalanceOptions,
  getWalletBalance,
} from "../wallets/utils/getWalletBalance.js";
// wallet connect
export {
  createWalletConnectClient,
  createWalletConnectSession,
  DefaultWalletConnectRequestHandlers,
  disconnectWalletConnectSession,
  getActiveWalletConnectSessions,
} from "../wallets/wallet-connect/receiver/index.js";
export type {
  WalletConnectClient,
  WalletConnectSession,
} from "../wallets/wallet-connect/receiver/types.js";
export type {
  WCAutoConnectOptions,
  WCConnectOptions,
} from "../wallets/wallet-connect/types.js";
export type {
  WalletEmitter,
  WalletEmitterEvents,
} from "../wallets/wallet-emitter.js";
export type { WalletInfo } from "../wallets/wallet-info.js";
export type {
  CreateWalletArgs,
  DeepLinkSupportedWalletCreationOptions,
  InjectedConnectOptions,
  StandaloneWCConnectOptions,
  WalletAutoConnectionOption,
  WalletConnectionOption,
  WalletCreationOptions,
  WalletId,
} from "../wallets/wallet-types.js";

// WEB ONLY EXPORTS

export { autoConnect } from "../wallets/connection/autoConnect.js";
export type { AutoConnectProps } from "../wallets/connection/types.js";
// injected
export {
  getInstalledWallets,
  injectedProvider,
} from "../wallets/injected/mipdStore.js";
export type { ConnectionManager } from "../wallets/manager/index.js";
export { deploySmartAccount } from "../wallets/smart/lib/signing.js";
