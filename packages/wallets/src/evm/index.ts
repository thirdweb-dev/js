export * from "./wallets/coinbase-wallet";
export * from "./wallets/metamask";
export * from "./wallets/wallet-connect";
export * from "./wallets/injected";
export * from "./wallets/aws-kms";
export * from "./wallets/aws-secrets-manager";
export * from "./wallets/magic-auth";
export * from "./wallets/private-key";
export * from "./wallets/ethers";
// just the types
export type {
  AbstractWallet,
  WalletData,
  WalletEvents,
  WalletOptions,
} from "./wallets/base";
export type { MinimalWallet } from "./interfaces/minimal";
