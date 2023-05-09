export { localWallet } from "./wallet/wallets/localWallet/localWallet";
export { coinbaseWallet } from "./wallet/wallets/coinbase/coinbaseWallet";
export { metamaskWallet } from "./wallet/wallets/metamask/metamaskWallet";
export { paperWallet } from "./wallet/wallets/paperWallet";
export { safeWallet } from "./wallet/wallets/safe/safeWallet";
export { walletConnect } from "./wallet/wallets/walletConnect";
export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";
export { smartWallet } from "./wallet/wallets/smartWallet/smartWallet";
export { magicLink } from "./wallet/wallets/magic/magicLink";

// at the moment we'll re-export everything from the evm package
export * from "./evm";
