export { useSmartWallet } from "./evm/hooks/wallets/useSmartWallet";
export { bloctoWallet } from "./wallet/wallets/blocto/bloctoWallet";
export { coinbaseWallet } from "./wallet/wallets/coinbase/coinbaseWallet";
export { embeddedWallet } from "./wallet/wallets/embeddedWallet";
export { frameWallet } from "./wallet/wallets/frame/frameWallet";
export { localWallet } from "./wallet/wallets/localWallet/localWallet";
export { magicLink } from "./wallet/wallets/magic/magicLink";
export { metamaskWallet } from "./wallet/wallets/metamask/metamaskWallet";
export { phantomWallet } from "./wallet/wallets/phantom/phantomWallet";
export { paperWallet } from "./wallet/wallets/paperWallet";
export { rainbowWallet } from "./wallet/wallets/rainbow/RainbowWallet";
export { safeWallet } from "./wallet/wallets/safe/safeWallet";
export { smartWallet } from "./wallet/wallets/smartWallet/smartWallet";
export { trustWallet } from "./wallet/wallets/trustWallet/TrustWallet";
export { walletConnect } from "./wallet/wallets/walletConnect";
export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";
export { zerionWallet } from "./wallet/wallets/zerion/zerionWallet";

// at the moment we'll re-export everything from the evm package
export * from "./evm";
