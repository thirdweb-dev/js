export { EIP155_SIGNING_METHODS } from "./constants/wc";

export { walletIds } from "./constants/walletIds";

export { WagmiConnector } from "../lib/wagmi-connectors/WagmiConnector";
export {
  AddChainError,
  ChainNotConfiguredError,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from "../lib/wagmi-core/errors";
export { normalizeChainId } from "../lib/wagmi-core/normalizeChainId";

export { DEFAULT_DAPP_META } from "./constants/dappMeta";
export type { EVMWallet } from "./interfaces";
export { Connector, WagmiAdapter } from "./interfaces/connector";
export type { ConnectParams } from "./interfaces/connector";
export type {
  AbstractWallet,
  WalletData,
  WalletEvents,
  checkContractWalletSignature,
} from "./wallets/abstract";

export * from "./wallets/paper-wallet";
// just the types
export { AbstractClientWallet } from "./wallets/base";
export type { WalletOptions } from "./wallets/base";
export { type BloctoOptions, BloctoWallet } from "./wallets/blocto";
export * from "./wallets/coinbase-wallet";
export * from "./wallets/embedded-wallet";
export * from "./wallets/ethers";
export * from "./wallets/frame";
export * from "./wallets/injected";
export * from "./wallets/local-wallet";
export * from "./wallets/signer";
export * from "./wallets/magic";

export {
  MetaMaskWallet,
  type MetamaskAdditionalOptions,
  type MetamaskWalletOptions,
} from "./wallets/metamask";

export * from "./wallets/xdefi";
export { getInjectedXDEFIProvider } from "./connectors/xdefi/getInjectedXDEFIProvider";

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

export {
  CoreWallet,
  type CoreWalletOptions,
  type CoreWalletAdditionalOptions,
} from "./wallets/core-wallet";
export { getInjectedCoreWalletProvider } from "./connectors/core-wallet/getInjectedCoreWalletProvider";

export { OneKeyWallet, type OneKeyOptions } from "./wallets/onekey";
export { getInjectedOneKeyProvider } from "./connectors/onekey/getInjectedOneKeyProvider";
export {
  CryptoDefiWallet,
  type CryptoDefiWalletOptions,
  type CryptoDefiWalletAdditionalOptions,
} from "./wallets/crypto-defi-wallet";
export { getInjectedCryptoDefiWalletProvider } from "./connectors/crypto-defi-wallet/getInjectedCryptoDefiWalletProvider";

export { RabbyWallet, type RabbyOptions } from "./wallets/rabby";
export { getInjectedRabbyProvider } from "./connectors/rabby/getInjectedRabbyProvider";

export {
  Coin98Wallet,
  type Coin98Options,
  type Coin98AdditionalOptions,
} from "./wallets/coin98";
export { getInjectedCoin98Provider } from "./connectors/coin98/getInjectedCoin98Provider";

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
