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
export type { NetworkSelectorProps } from "../react/ui/ConnectWallet/NetworkSelector.js";
export type { WelcomeScreen } from "../react/ui/ConnectWallet/screens/types.js";

export {
  TransactionButton,
  type TransactionButtonProps,
} from "../react/ui/TransactionButton/index.js";

export {
  ThirdwebProvider,
  type ThirdwebProviderProps,
} from "../react/providers/thirdweb-provider.js";

export {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useConnect,
  useConnectedWallets,
  useDisconnect,
  useIsAutoConnecting,
  useSetActiveWallet,
  useSetActiveWalletConnectionStatus,
  useSwitchActiveWalletChain,
} from "../react/providers/wallet-provider.js";

// contract related
export { useContractEvents } from "../react/hooks/contract/useContractEvents.js";
export { useEstimateGas } from "../react/hooks/contract/useEstimate.js";
export { useReadContract } from "../react/hooks/contract/useRead.js";
export { useSendTransaction } from "../react/hooks/contract/useSend.js";
export { useWaitForReceipt } from "../react/hooks/contract/useWaitForReceipt.js";

// rpc related
export {
  useBlockNumber,
  type UseBlockNumberOptions,
} from "../react/hooks/rpc/useBlockNumber.js";

// utils
export { useInvalidateContractQuery } from "../react/hooks/others/useInvalidateQueries.js";
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

export {
  localWalletConfig,
  type LocalWalletConfigOptions,
} from "../react/wallets/local/localWalletConfig.js";

export { defaultTokens } from "../react/ui/ConnectWallet/defaultTokens.js";
export type { SupportedTokens } from "../react/ui/ConnectWallet/defaultTokens.js";

export { useSwapQuote } from "../react/hooks/pay/useBuyWithCryptoQuote.js";
export { useSwapStatus } from "../react/hooks/pay/useBuyWithCryptoStatus.js";
export { useSendSwapTransaction } from "../react/hooks/pay/useSendSwapTransaction.js";

export { defaultWallets } from "../react/wallets/defaultWallets.js";

export { en } from "../react/ui/locales/en.js";
export { es } from "../react/ui/locales/es.js";
export { ja } from "../react/ui/locales/ja.js";
export { tl } from "../react/ui/locales/tl.js";
export type { ThirdwebLocale } from "../react/ui/locales/types.js";

export { MediaRenderer } from "../react/ui/MediaRenderer/MediaRenderer.js";
export type { MediaRendererProps } from "../react/ui/MediaRenderer/types.js";
