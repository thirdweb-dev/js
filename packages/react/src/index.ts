// at the moment we'll re-export everything from the evm package
export * from "./evm";

export {
  MetaMask as MetamaskWallet,
  CoinbaseWallet,
  DeviceBrowserWallet as DeviceWallet,
  WalletConnect,
} from "@thirdweb-dev/wallets";
