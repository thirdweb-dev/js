export * from "./wallets/coinbase-wallet";
export * from "./wallets/metamask";
export * from "./wallets/wallet-connect";
export * from "./wallets/injected";
export * from "./wallets/magic-auth";
// just the types
export type {
  AbstractWallet,
  WalletData,
  WalletEvents,
  WalletOptions,
} from "./wallets/base";
