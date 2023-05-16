export { walletIds } from "./constants/walletIds";

export { CredentialsStorage } from "../core/CredentialsStorage";

export type { IWalletConnectReceiver } from "../core/WalletConnect/IWalletConnectReceiver";
export { WalletConnectV2Receiver } from "../core/WalletConnect/WalletConnectV2Receiver";

export { WagmiConnector } from "../lib/wagmi-connectors";
export type { DAppMetaData } from "../core/types/dAppMeta";
export { DEFAULT_DAPP_META } from "./constants/dappMeta";
export {
  AddChainError,
  ChainNotConfiguredError,
  normalizeChainId,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from "../lib/wagmi-core";
export type { EVMWallet } from "./interfaces";
export type { ConnectParams } from "./interfaces/connector";
export { Connector, WagmiAdapter } from "./interfaces/connector";
export type {
  AbstractWallet,
  WalletData,
  WalletEvents,
} from "./wallets/abstract";

export * from "./wallets/paper-wallet";
// just the types
export type { WalletOptions } from "./wallets/base";
export { AbstractClientWallet } from "./wallets/base";
export * from "./wallets/coinbase-wallet";
export * from "./wallets/local-wallet";
export * from "./wallets/injected";
export * from "./wallets/metamask";
export * from "./wallets/wallet-connect";
export * from "./wallets/wallet-connect-v1";
export * from "./wallets/safe";
export * from "./wallets/magic";
export * from "./wallets/smart-wallet";
export * from "./wallets/ethers";
export * from "./wallets/private-key";

export type { Chain } from "@thirdweb-dev/chains";

// export the window ethereum util
export { assertWindowEthereum } from "./utils/assertWindowEthereum";
