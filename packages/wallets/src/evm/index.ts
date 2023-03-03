export { Connector } from "../lib/wagmi-connectors";
export { WagmiAdapter } from "./interfaces/tw-connector";

export type { DAppMetaData } from "../core/types/dAppMeta";
export {
  AddChainError,
  ChainNotConfiguredError,
  normalizeChainId,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from "../lib/wagmi-core";
export type { EVMWallet } from "./interfaces";
export type { ConnectParams, TWConnector } from "./interfaces/tw-connector";
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
export type { MetamaskWalletOptions } from "./wallets/metamask";
export * from "./wallets/private-key";
export * from "./wallets/wallet-connect";
export type { WalletConnectOptions } from "./wallets/wallet-connect";

export type { Chain } from "../lib/wagmi-core";
export * from "./wallets/wallet-connect-v1";
export type { WalletConnectV1Options } from "./wallets/wallet-connect-v1";
export type { CoinbaseWalletOptions } from "./wallets/coinbase-wallet";
