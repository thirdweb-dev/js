export * from "./wallets/coinbase-wallet";
export * from "./wallets/metamask";
export * from "./wallets/wallet-connect";
export * from "./wallets/injected";
export * from "./wallets/aws-kms";
export * from "./wallets/aws-secrets-manager";
export * from "./wallets/magic-auth";
export * from "./wallets/private-key";
export * from "./wallets/ethers";
export * from "./wallets/device-wallet";
// just the types
export type { AbstractBrowserWallet, WalletOptions } from "./wallets/base";
export type { WalletData, WalletEvents } from "./wallets/abstract";
export type { EVMWallet } from "./interfaces";
