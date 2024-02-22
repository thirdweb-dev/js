export { darkTheme, lightTheme } from "../react/ui/design-system/index.js";
export type { Theme, ThemeOverrides } from "../react/ui/design-system/index.js";

export { ConnectButton } from "../react/ui/ConnectWallet/ConnectWallet.js";
export {
  ConnectEmbed,
  type ConnectEmbedProps,
} from "../react/ui/ConnectWallet/Modal/ConnectEmbed.js";

export type {
  ConnectButtonProps,
  ConnectButton_connectButtonOptions,
  ConnectButton_connectModalOptions,
  ConnectButton_detailsButtonOptions,
  ConnectButton_detailsModalOptions,
} from "../react/ui/ConnectWallet/ConnectWalletProps.js";
export type { WelcomeScreen } from "../react/ui/ConnectWallet/screens/types.js";
export type { NetworkSelectorProps } from "../react/ui/ConnectWallet/NetworkSelector.js";

export {
  TransactionButton,
  type TransactionButtonProps,
} from "../react/ui/TransactionButton/index.js";

export {
  ThirdwebProvider,
  type ThirdwebProviderProps,
} from "../react/providers/thirdweb-provider.js";

export {
  useSetActiveWallet,
  useActiveWalletChain,
  useConnect,
  useDisconnect,
  useActiveAccount,
  useActiveWallet,
  useConnectedWallets,
  useSwitchActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSetActiveWalletConnectionStatus,
  useIsAutoConnecting,
} from "../react/providers/wallet-provider.js";

// contract related
export { useReadContract } from "../react/hooks/contract/useRead.js";
export { useSendTransaction } from "../react/hooks/contract/useSend.js";
export { useEstimateGas } from "../react/hooks/contract/useEstimate.js";
export { useWaitForReceipt } from "../react/hooks/contract/useWaitForReceipt.js";
export { useContractEvents } from "../react/hooks/contract/useContractEvents.js";

// rpc related
export {
  useBlockNumber,
  type UseBlockNumberOptions,
} from "../react/hooks/rpc/useBlockNumber.js";

// utils
export { createContractQuery } from "../react/utils/createQuery.js";

// wallets
export {
  metamaskConfig,
  type MetamaskConfigOptions,
} from "../react/wallets/metamask/metamaskConfig.js";

export {
  coinbaseConfig,
  type CoinbaseConfigOptions,
} from "../react/wallets/coinbase/coinbaseConfig.js";

export {
  rainbowConfig,
  type RainbowConfigOptions,
} from "../react/wallets/rainbow/rainbowConfig.js";

export {
  walletConnectConfig,
  type WalletConnectConfigOptions,
} from "../react/wallets/walletConnect/walletConnectConfig.js";

export {
  zerionConfig,
  type ZerionConfigOptions,
} from "../react/wallets/zerion/zerionConfig.js";

export {
  smartWalletConfig,
  type SmartWalletConfigOptions,
} from "../react/wallets/smartWallet/smartWalletConfig.js";

export {
  embeddedWalletConfig,
  type EmbeddedWalletConfigOptions,
} from "../react/wallets/embedded/embeddedWalletConfig.js";
export type { EmbeddedWalletAuth } from "../react/wallets/embedded/types.js";

export type { SupportedTokens } from "../react/ui/ConnectWallet/defaultTokens.js";
export { defaultTokens } from "../react/ui/ConnectWallet/defaultTokens.js";

export { useSendSwap } from "../react/hooks/pay/useSendSwap.js";

export {
  useSwapRoute,
  type SwapRoute,
  type SwapRouteParams,
} from "../react/hooks/pay/useSwapRoute.js";

export {
  useSwapStatus,
  type SwapStatus,
  type SwapStatusParams,
} from "../react/hooks/pay/useSwapStatus.js";

export { defaultWallets } from "../react/wallets/defaultWallets.js";

export { en } from "../react/ui/locales/en.js";
export { es } from "../react/ui/locales/es.js";
export { ja } from "../react/ui/locales/ja.js";
export { tl } from "../react/ui/locales/tl.js";
export type { ThirdwebLocale } from "../react/ui/locales/types.js";
