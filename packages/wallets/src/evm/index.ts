export { Connector } from "../lib/wagmi-connectors";
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
export { WagmiAdapter } from "./interfaces/tw-connector";
export type {
  AbstractWallet,
  WalletData,
  WalletEvents,
} from "./wallets/abstract";
export * from "./wallets/aws-kms";
export * from "./wallets/aws-secrets-manager";
export * from "./wallets/paper-wallet";
// just the types
export type { WalletOptions } from "./wallets/base";
export { AbstractBrowserWallet } from "./wallets/base";
export * from "./wallets/coinbase-wallet";
export * from "./wallets/device-wallet";
export * from "./wallets/ethers";
export * from "./wallets/injected";
export * from "./wallets/metamask";
export * from "./wallets/private-key";
export * from "./wallets/wallet-connect";
export * from "./wallets/wallet-connect-v1";

export type { Chain } from "@thirdweb-dev/chains";
