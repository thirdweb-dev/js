export { coinbaseWallet } from "./wallet/wallets/coinbaseWallet";
export { metamaskWallet } from "./wallet/wallets/metamaskWallet";
export { paperWallet } from "./wallet/wallets/paperWallet";
export { safeWallet } from "./wallet/wallets/safeWallet";
export { walletConnect } from "./wallet/wallets/walletConnect";
export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";

// at the moment we'll re-export everything from the evm package
export * from "./evm";
