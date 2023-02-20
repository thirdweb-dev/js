import type {
  CoinbaseWallet,
  DeviceBrowserWallet,
  MetaMask,
} from "@thirdweb-dev/wallets";

export type DeviceWalletType = typeof DeviceBrowserWallet;
export type MetaMaskWalletType = typeof MetaMask;
export type CoinbaseWalletType = typeof CoinbaseWallet;

export type SupportedWallet =
  | DeviceWalletType
  | MetaMaskWalletType
  | CoinbaseWalletType;
