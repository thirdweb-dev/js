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
export * from "./wallets/embedded-wallet";
export * from "./wallets/ethers";
export * from "./wallets/frame";
export * from "./wallets/injected";
export * from "./wallets/local-wallet";
export * from "./wallets/signer";
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
export * from "./wallets/token-bound-smart-wallet";
export * from "./wallets/engine";

export { OKXWallet, type OKXWalletOptions } from "./wallets/okx";
export { getInjectedOKXProvider } from "./connectors/okx/getInjectedOKXProvider";

export { CoreWallet, type CoreWalletOptions } from "./wallets/core-wallet";
export { getInjectedCoreWalletProvider } from "./connectors/core-wallet/getInjectedCoreWalletProvider";

export { RabbyWallet, type RabbyOptions } from "./wallets/rabby";
export { getInjectedRabbyProvider } from "./connectors/rabby/getInjectedRabbyProvider";

export type { Chain } from "@thirdweb-dev/chains";

// export the window ethereum util
export { getInjectedMetamaskProvider } from "./connectors/metamask/getInjectedMetamaskProvider";
export { getInjectedPhantomProvider } from "./connectors/phantom/getInjectedPhantomProvider";
export { getInjectedRainbowProvider } from "./connectors/rainbow/getInjectedRainbowProvider";
export { getInjectedCoinbaseProvider } from "./connectors/coinbase-wallet/getInjectedCoinbaseProvider";
export { assertWindowEthereum } from "./utils/assertWindowEthereum";
export * from "./utils/setWalletAnaltyicsEnabled";

// ThirdwebEmbeddedWalletSdk
export * from "./connectors/embedded-wallet/implementations";

// EngineSigner
export { EngineSigner } from "./connectors/engine/signer";
