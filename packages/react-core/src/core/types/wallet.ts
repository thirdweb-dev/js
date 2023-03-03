import type {
  CoinbaseWallet,
  CoinbaseWalletMobile,
  DeviceBrowserWallet,
  MetaMask,
  WalletConnect,
  WalletConnectV1,
} from "@thirdweb-dev/wallets";

export type DeviceWalletType = typeof DeviceBrowserWallet;
export type MetaMaskWalletType = typeof MetaMask;
export type CoinbaseWalletType = typeof CoinbaseWallet;
export type CoinbaseWalletMobileType = typeof CoinbaseWalletMobile;
export type WalletConnectWalletType = typeof WalletConnect;
export type WalletConnectV1WalletType = typeof WalletConnectV1;

export type SupportedWallet =
  | DeviceWalletType
  | MetaMaskWalletType
  | CoinbaseWalletType
  | CoinbaseWalletMobileType
  | WalletConnectWalletType
  | WalletConnectV1WalletType;
