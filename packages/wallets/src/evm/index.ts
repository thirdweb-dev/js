export { Connector } from "../lib/wagmi-connectors";
export type { EVMWallet } from "./interfaces";
export type { ConnectParams, TWConnector } from "./interfaces/tw-connector";
export { WagmiAdapter } from "./interfaces/tw-connector";
export type {
  AbstractWallet,
  WalletData,
  WalletEvents,
} from "./wallets/abstract";
export * from "./wallets/aws-kms";
export * from "./wallets/aws-secrets-manager";
// just the types
export type { WalletOptions } from "./wallets/base";
export { AbstractBrowserWallet } from "./wallets/base";
export * from "./wallets/coinbase-wallet";
export * from "./wallets/device-wallet";
export type { DeviceWalletConnectionArgs } from "./wallets/device-wallet";
export * from "./wallets/ethers";
export * from "./wallets/injected";
export * from "./wallets/magic-auth";
export * from "./wallets/metamask";
export * from "./wallets/private-key";
export * from "./wallets/wallet-connect";
export * from "./wallets/wallet-connect-v1";
export type { MetamaskWalletOptions } from "./wallets/metamask";
export type { WalletConnectV1Options } from "./wallets/wallet-connect-v1";
export type { WalletConnectOptions } from "./wallets/wallet-connect";

export type { Chain } from "../lib/wagmi-core";
export {
  UserRejectedRequestError,
  ChainNotConfiguredError,
  AddChainError,
  SwitchChainError,
  normalizeChainId,
  ProviderRpcError,
} from "../lib/wagmi-core";
