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
export * from "./wallets/phantom";
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
export { getInjectedPhantomProvider } from "./connectors/phantom/getInjectedPhantomProvider";
export { getInjectedRainbowProvider } from "./connectors/rainbow/getInjectedRainbowProvider";
export { assertWindowEthereum } from "./utils/assertWindowEthereum";

// ThirdwebEmbeddedWalletSdk
export * from "./implementations/embedded-wallet";
