export { coinbaseWallet } from "./wallet/wallets/coinbaseWallet";
export { deviceWallet, DeviceWallet } from "./wallet/wallets/deviceWallet";
export { metamaskWallet } from "./wallet/wallets/metamaskWallet";
export { paperWallet } from "./wallet/wallets/paperWallet";
export { safeWallet } from "./wallet/wallets/safeWallet";
export { walletConnect } from "./wallet/wallets/walletConnect";
export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";

export { PaperWallet } from "@thirdweb-dev/wallets";
export { SafeWallet } from "@thirdweb-dev/wallets";
export { WalletConnect } from "@thirdweb-dev/wallets";
export { WalletConnectV1 } from "@thirdweb-dev/wallets";
export { CoinbaseWallet } from "@thirdweb-dev/wallets";
export { MetaMask as MetamaskWallet } from "@thirdweb-dev/wallets";

// at the moment we'll re-export everything from the evm package
export * from "./evm";
