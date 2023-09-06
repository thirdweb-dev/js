export { useSmartWallet } from "./evm/hooks/wallets/useSmartWallet";
export { localWallet } from "./wallet/wallets/localWallet/localWallet";
export { coinbaseWallet } from "./wallet/wallets/coinbase/coinbaseWallet";
export { frameWallet } from "./wallet/wallets/frame/frameWallet";
export { metamaskWallet } from "./wallet/wallets/metamask/metamaskWallet";
export { paperWallet } from "./wallet/wallets/paper/paperWallet";
export { rainbowWallet } from "./wallet/wallets/rainbow/RainbowWallet";
export { safeWallet } from "./wallet/wallets/safe/safeWallet";
export { trustWallet } from "./wallet/wallets/trustWallet/TrustWallet";
export { walletConnect } from "./wallet/wallets/walletConnect";
export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";
export { smartWallet } from "./wallet/wallets/smartWallet/smartWallet";
export { magicLink } from "./wallet/wallets/magic/magicLink";
export { zerionWallet } from "./wallet/wallets/zerion/zerionWallet";
export { bloctoWallet } from "./wallet/wallets/blocto/bloctoWallet";

// at the moment we'll re-export everything from the evm package
export * from "./evm";
