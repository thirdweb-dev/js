export { CredentialsStorage } from "../core/CredentialsStorage";

export { Connector } from "../lib/wagmi-connectors";
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
export type { ConnectParams } from "./interfaces/tw-connector";
export { TWConnector, WagmiAdapter } from "./interfaces/tw-connector";
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
export * from "./wallets/device-wallet";
export * from "./wallets/injected";
export * from "./wallets/metamask";
export * from "./wallets/wallet-connect";
export * from "./wallets/wallet-connect-v1";
export * from "./wallets/safe";
export * from "./wallets/smart-wallet";

export type { Chain } from "@thirdweb-dev/chains";

// export the window ethereum util
export { assertWindowEthereum } from "./utils/assertWindowEthereum";
