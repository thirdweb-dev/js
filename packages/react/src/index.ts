export {
  defaultTokens,
  type TokenInfo,
} from "./wallet/ConnectWallet/defaultTokens";

export { defaultWallets } from "./wallet/wallets/defaultWallets";

export { useSmartWallet } from "./evm/hooks/wallets/useSmartWallet";

export {
  bloctoWallet,
  type BloctoWalletConfigOptions,
} from "./wallet/wallets/blocto/bloctoWallet";
export {
  coinbaseWallet,
  type CoinbaseWalletConfigOptions,
} from "./wallet/wallets/coinbase/coinbaseWallet";
export { embeddedWallet } from "./wallet/wallets/embeddedWallet/embeddedWallet";
export type { EmbeddedWalletConfigOptions } from "./wallet/wallets/embeddedWallet/types";

export {
  frameWallet,
  type FrameWalletConfigOptions,
} from "./wallet/wallets/frame/frameWallet";

export { localWallet } from "./wallet/wallets/localWallet/localWallet";
export type { LocalWalletConfigOptions } from "./wallet/wallets/localWallet/types";

export {
  magicLink,
  type MagicWalletConfigOptions,
} from "./wallet/wallets/magic/magicLink";
export {
  metamaskWallet,
  type MetamaskWalletConfigOptions,
} from "./wallet/wallets/metamask/metamaskWallet";

export { paperWallet } from "./wallet/wallets/paper/paperWallet";
export type { PaperWalletConfigOptions } from "./wallet/wallets/paper/types";

export {
  phantomWallet,
  type PhantomWalletConfigOptions,
} from "./wallet/wallets/phantom/phantomWallet";

export {
  rainbowWallet,
  type RainbowWalletConfigOptions,
} from "./wallet/wallets/rainbow/RainbowWallet";

export {
  safeWallet,
  type SafeWalletConfigOptions,
} from "./wallet/wallets/safe/safeWallet";

export { smartWallet } from "./wallet/wallets/smartWallet/smartWallet";
export type { SmartWalletConfigOptions } from "./wallet/wallets/smartWallet/types";

export {
  trustWallet,
  type TrustWalletConfigOptions,
} from "./wallet/wallets/trustWallet/TrustWallet";

export {
  walletConnect,
  type walletConnectConfigOptions,
} from "./wallet/wallets/walletConnect/walletConnect";

export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";
export {
  zerionWallet,
  type ZerionkWalletConfigOptions,
} from "./wallet/wallets/zerion/zerionWallet";

export {
  okxWallet,
  type OKXWalletConfigOptions,
} from "./wallet/wallets/okx/okxWallet";

export {
  coreWallet,
  type CoreWalletConfigOptions,
} from "./wallet/wallets/coreWallet/coreWallet";

export {
  cryptoDefiWallet,
  type CryptoDefiWalletConfigOptions,
} from "./wallet/wallets/defiWallet/cryptoDefiWallet";

export {
  rabbyWallet,
  type RabbyWalletConfigOptions,
} from "./wallet/wallets/rabby/rabbyWallet";

export {
  coin98Wallet,
  type Coin98WalletConfigOptions,
} from "./wallet/wallets/coin98/coin98Wallet";

// theming
export { darkTheme, lightTheme } from "./design-system/index";
export type { Theme, ThemeOverrides } from "./design-system/index";

// locales
export { en } from "./evm/locales/en";
export { ja } from "./evm/locales/ja";
export { es } from "./evm/locales/es";
export { tl } from "./evm/locales/tl";

export type {
  ThirdwebLocale,
  ExtensionAndQRScreensLocale,
} from "./evm/locales/types";

// at the moment we'll re-export everything from the evm package
export * from "./evm";
export * from "./payments";
