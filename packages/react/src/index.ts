export { defaultTokens } from "./wallet/ConnectWallet/defaultTokens";
export { defaultWallets } from "./wallet/wallets/defaultWallets";

export { useSmartWallet } from "./evm/hooks/wallets/useSmartWallet";
export { bloctoWallet } from "./wallet/wallets/blocto/bloctoWallet";
export { coinbaseWallet } from "./wallet/wallets/coinbase/coinbaseWallet";
export { embeddedWallet } from "./wallet/wallets/embeddedWallet/embeddedWallet";
export { frameWallet } from "./wallet/wallets/frame/frameWallet";
export { localWallet } from "./wallet/wallets/localWallet/localWallet";
export { magicLink } from "./wallet/wallets/magic/magicLink";
export { metamaskWallet } from "./wallet/wallets/metamask/metamaskWallet";
export { paperWallet } from "./wallet/wallets/paper/paperWallet";
export { phantomWallet } from "./wallet/wallets/phantom/phantomWallet";
export { rainbowWallet } from "./wallet/wallets/rainbow/RainbowWallet";
export { safeWallet } from "./wallet/wallets/safe/safeWallet";
export { smartWallet } from "./wallet/wallets/smartWallet/smartWallet";
export { trustWallet } from "./wallet/wallets/trustWallet/TrustWallet";
export { walletConnect } from "./wallet/wallets/walletConnect/walletConnect";
export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";
export { zerionWallet } from "./wallet/wallets/zerion/zerionWallet";
export { okxWallet } from "./wallet/wallets/okx/okxWallet";
export { coreWallet } from "./wallet/wallets/coreWallet/coreWallet";
export { defiWallet } from "./wallet/wallets/defiWallet/defiWallet";
export { coin98Wallet } from "./wallet/wallets/coin98/coin98Wallet";
export { darkTheme, lightTheme } from "./design-system/index";
export type { Theme, ThemeOverrides } from "./design-system/index";

// at the moment we'll re-export everything from the evm package
export * from "./evm";

// locales
export { en } from "./evm/locales/en";
export { ja } from "./evm/locales/ja";
export { es } from "./evm/locales/es";
