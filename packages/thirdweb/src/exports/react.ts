export {
  ThirdwebProvider,
  type ThirdwebProviderProps,
} from "../react/web/providers/thirdweb-provider.js";

export { darkTheme, lightTheme } from "../react/web/ui/design-system/index.js";
export type {
  Theme,
  ThemeOverrides,
} from "../react/web/ui/design-system/index.js";

export { ConnectButton } from "../react/web/ui/ConnectWallet/ConnectWallet.js";
export {
  ConnectEmbed,
  type ConnectEmbedProps,
} from "../react/web/ui/ConnectWallet/Modal/ConnectEmbed.js";

export type {
  ConnectButtonProps,
  ConnectButton_connectButtonOptions,
  ConnectButton_connectModalOptions,
  ConnectButton_detailsButtonOptions,
  ConnectButton_detailsModalOptions,
} from "../react/web/ui/ConnectWallet/ConnectWalletProps.js";
export type { WelcomeScreen } from "../react/web/ui/ConnectWallet/screens/types.js";
export type { NetworkSelectorProps } from "../react/web/ui/ConnectWallet/NetworkSelector.js";

export {
  TransactionButton,
  type TransactionButtonProps,
} from "../react/web/ui/TransactionButton/index.js";

export { MediaRenderer } from "../react/web/ui/MediaRenderer/MediaRenderer.js";
export type { MediaRendererProps } from "../react/web/ui/MediaRenderer/types.js";

export type { SupportedTokens } from "../react/web/ui/ConnectWallet/defaultTokens.js";
export { defaultTokens } from "../react/web/ui/ConnectWallet/defaultTokens.js";

export { defaultWallets } from "../react/web/wallets/defaultWallets.js";

// wallets
export {
  metamaskConfig,
  type MetamaskConfigOptions,
} from "../react/web/wallets/metamask/metamaskConfig.js";

export {
  coinbaseConfig,
  type CoinbaseConfigOptions,
} from "../react/web/wallets/coinbase/coinbaseConfig.js";

export {
  rainbowConfig,
  type RainbowConfigOptions,
} from "../react/web/wallets/rainbow/rainbowConfig.js";

export {
  walletConnectConfig,
  type WalletConnectConfigOptions,
} from "../react/web/wallets/walletConnect/walletConnectConfig.js";

export {
  zerionConfig,
  type ZerionConfigOptions,
} from "../react/web/wallets/zerion/zerionConfig.js";

export {
  okxConfig,
  type OkxConfigOptions,
} from "../react/web/wallets/okx/okxConfig.js";

export {
  smartWalletConfig,
  type SmartWalletConfigOptions,
} from "../react/web/wallets/smartWallet/smartWalletConfig.js";

export {
  embeddedWalletConfig,
  type EmbeddedWalletConfigOptions,
} from "../react/web/wallets/embedded/embeddedWalletConfig.js";
export type { EmbeddedWalletAuth } from "../react/web/wallets/embedded/types.js";

export {
  type LocalWalletConfigOptions,
  localWalletConfig,
} from "../react/web/wallets/local/localWalletConfig.js";

// react/core
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
} from "../react/core/hooks/wallets/wallet-hooks.js";

// contract related
export { useReadContract } from "../react/core/hooks/contract/useRead.js";
export { useSendTransaction } from "../react/core/hooks/contract/useSend.js";
export { useEstimateGas } from "../react/core/hooks/contract/useEstimate.js";
export { useWaitForReceipt } from "../react/core/hooks/contract/useWaitForReceipt.js";
export { useContractEvents } from "../react/core/hooks/contract/useContractEvents.js";

// rpc related
export {
  useBlockNumber,
  type UseBlockNumberOptions,
} from "../react/core/hooks/rpc/useBlockNumber.js";

// utils
export { createContractQuery } from "../react/core/utils/createQuery.js";
export { useInvalidateContractQuery } from "../react/core/hooks/others/useInvalidateQueries.js";

export { useSendSwap } from "../react/core/hooks/pay/useSendSwap.js";

export {
  useSwapRoute,
  type SwapRoute,
  type SwapRouteParams,
} from "../react/core/hooks/pay/useSwapRoute.js";

export {
  useSwapStatus,
  type SwapStatus,
  type SwapStatusParams,
} from "../react/core/hooks/pay/useSwapStatus.js";

export type { UILocale } from "../react/web/ui/types.js";
