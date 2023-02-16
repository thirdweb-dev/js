import type { DeviceBrowserWallet, MetaMask } from "@thirdweb-dev/wallets";

export type DeviceWalletType = typeof DeviceBrowserWallet;
export type MetaMaskWalletType = typeof MetaMask;

export type SupportedWallet = DeviceWalletType | MetaMaskWalletType;
