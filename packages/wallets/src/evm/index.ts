export { EIP155_SIGNING_METHODS } from "./constants/wc";

export { walletIds } from "./constants/walletIds";

export { WagmiConnector } from "../lib/wagmi-connectors";
export {
  AddChainError,
  ChainNotConfiguredError,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  normalizeChainId,
} from "../lib/wagmi-core";
export { DEFAULT_DAPP_META } from "./constants/dappMeta";
export type { EVMWallet } from "./interfaces";
export { Connector, WagmiAdapter } from "./interfaces/connector";
export type { ConnectParams } from "./interfaces/connector";
export type {
  AbstractWallet,
  WalletData,
  WalletEvents,
} from "./wallets/abstract";

export * from "./wallets/paper-wallet";
// just the types
export { AbstractClientWallet } from "./wallets/base";
export type { WalletOptions } from "./wallets/base";
export * from "./wallets/blocto";
export * from "./wallets/coinbase-wallet";
export * from "./wallets/ethers";
export * from "./wallets/frame";
export * from "./wallets/injected";
export * from "./wallets/local-wallet";
export * from "./wallets/magic";
export * from "./wallets/metamask";
export * from "./wallets/private-key";
export * from "./wallets/rainbow-wallet";
export * from "./wallets/safe";
export * from "./wallets/smart-wallet";
export * from "./wallets/trust";
export * from "./wallets/wallet-connect";
export * from "./wallets/wallet-connect-v1";
export * from "./wallets/zerion";

export type { Chain } from "@thirdweb-dev/chains";

// export the window ethereum util
export { getInjectedMetamaskProvider } from "./connectors/metamask/getInjectedMetamaskProvider";
export { getInjectedRainbowProvider } from "./connectors/rainbow/getInjectedRainbowProvider";
export { assertWindowEthereum } from "./utils/assertWindowEthereum";

// ThirdwebEmbeddedWalletSdk
export {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME_DEPRECATED,
  WALLET_USER_DETAILS_LOCAL_STORAGE_NAME,
  WALLET_USER_ID_LOCAL_STORAGE_NAME,
} from "./implementations/thirdwebEmbeddedWallet/constants/settings";
export {
  AuthProvider,
  RecoveryShareManagement,
} from "./implementations/thirdwebEmbeddedWallet/interfaces/Auth";
export type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  GetSocialLoginClientIdReturnType,
  StoredTokenType,
} from "./implementations/thirdwebEmbeddedWallet/interfaces/Auth";
export { UserStatus } from "./implementations/thirdwebEmbeddedWallet/interfaces/EmbeddedWallets/EmbeddedWallets";
export type {
  AuthDetails,
  GetAuthDetailsReturnType,
  GetUser,
  GetUserWalletStatusRpcReturnType,
  InitializedUser,
  LogoutReturnType,
  SendEmailOtpReturnType,
  SetUpWalletRpcReturnType,
  ThirdwebConstructorType,
} from "./implementations/thirdwebEmbeddedWallet/interfaces/EmbeddedWallets/EmbeddedWallets";
export type {
  GetAddressReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
  SignedTypedDataReturnType,
} from "./implementations/thirdwebEmbeddedWallet/interfaces/EmbeddedWallets/Signer";
export { ThirdwebEmbeddedWalletSdk } from "./implementations/thirdwebEmbeddedWallet/lib/thirdweb";
