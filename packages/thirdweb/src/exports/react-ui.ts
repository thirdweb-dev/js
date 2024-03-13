export { darkTheme, lightTheme } from "../react-ui/ui/design-system/index.js";
export type {
  Theme,
  ThemeOverrides,
} from "../react-ui/ui/design-system/index.js";

export { ConnectButton } from "../react-ui/ui/ConnectWallet/ConnectWallet.js";
export {
  ConnectEmbed,
  type ConnectEmbedProps,
} from "../react-ui/ui/ConnectWallet/Modal/ConnectEmbed.js";

export type {
  ConnectButtonProps,
  ConnectButton_connectButtonOptions,
  ConnectButton_connectModalOptions,
  ConnectButton_detailsButtonOptions,
  ConnectButton_detailsModalOptions,
} from "../react-ui/ui/ConnectWallet/ConnectWalletProps.js";
export type { WelcomeScreen } from "../react-ui/ui/ConnectWallet/screens/types.js";
export type { NetworkSelectorProps } from "../react-ui/ui/ConnectWallet/NetworkSelector.js";

export {
  TransactionButton,
  type TransactionButtonProps,
} from "../react-ui/ui/TransactionButton/index.js";

export { MediaRenderer } from "../react-ui/ui/MediaRenderer/MediaRenderer.js";
export type { MediaRendererProps } from "../react-ui/ui/MediaRenderer/types.js";

// wallets
export {
  metamaskConfig,
  type MetamaskConfigOptions,
} from "../react-ui/wallets/metamask/metamaskConfig.js";

export {
  coinbaseConfig,
  type CoinbaseConfigOptions,
} from "../react-ui/wallets/coinbase/coinbaseConfig.js";

export {
  rainbowConfig,
  type RainbowConfigOptions,
} from "../react-ui/wallets/rainbow/rainbowConfig.js";

export {
  walletConnectConfig,
  type WalletConnectConfigOptions,
} from "../react-ui/wallets/walletConnect/walletConnectConfig.js";

export {
  zerionConfig,
  type ZerionConfigOptions,
} from "../react-ui/wallets/zerion/zerionConfig.js";

export {
  smartWalletConfig,
  type SmartWalletConfigOptions,
} from "../react-ui/wallets/smartWallet/smartWalletConfig.js";

export {
  embeddedWalletConfig,
  type EmbeddedWalletConfigOptions,
} from "../react-ui/wallets/embedded/embeddedWalletConfig.js";
export type { EmbeddedWalletAuth } from "../react-ui/wallets/embedded/types.js";

export {
  type LocalWalletConfigOptions,
  localWalletConfig,
} from "../react-ui/wallets/local/localWalletConfig.js";
