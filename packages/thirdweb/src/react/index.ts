export { darkTheme, lightTheme } from "./ui/design-system/index.js";
export type { Theme, ThemeOverrides } from "./ui/design-system/index.js";

export { ConnectButton } from "./ui/ConnectWallet/ConnectWallet.js";
export { ConnectEmbed } from "./ui/ConnectWallet/Modal/ConnectEmbed.js";

export type {
  ConnectButtonProps,
  ConnectButton_connectButtonOptions,
  ConnectButton_connectModalOptions,
  ConnectButton_detailsButtonOptions,
  ConnectButton_detailsModalOptions,
} from "./ui/ConnectWallet/ConnectWalletProps.js";
export type { WelcomeScreen } from "./ui/ConnectWallet/screens/types.js";
export type { NetworkSelectorProps } from "./ui/ConnectWallet/NetworkSelector.js";

export {
  TransactionButton,
  type TransactionButtonProps,
} from "./ui/TransactionButton/index.js";

export {
  ThirdwebProvider,
  type ThirdwebProviderProps,
} from "./providers/thirdweb-provider.js";

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
} from "./providers/wallet-provider.js";

// contract related
export { useReadContract } from "./hooks/contract/useRead.js";
export { useSendTransaction } from "./hooks/contract/useSend.js";
export { useEstimateGas } from "./hooks/contract/useEstimate.js";
export { useWaitForReceipt } from "./hooks/contract/useWaitForReceipt.js";
export { useContractEvents } from "./hooks/contract/useContractEvents.js";

// rpc related
export {
  useBlockNumber,
  type UseBlockNumberOptions,
} from "./hooks/rpc/useBlockNumber.js";

// utils
export { createContractQuery } from "./utils/createQuery.js";

// wallets
export {
  metamaskConfig,
  type MetamaskConfigOptions,
} from "./wallets/metamask/metamaskConfig.js";

export { coinbaseConfig } from "./wallets/coinbase/coinbaseConfig.js";

export {
  rainbowConfig,
  type RainbowConfigOptions,
} from "./wallets/rainbow/rainbowConfig.js";

export {
  walletConnectConfig,
  type WalletConnectConfigOptions,
} from "./wallets/walletConnect/walletConnectConfig.js";

export {
  zerionConfig,
  type ZerionConfigOptions,
} from "./wallets/zerion/zerionConfig.js";

export {
  smartWalletConfig,
  type SmartWalletConfigOptions,
} from "./wallets/smartWallet/smartWalletConfig.js";

export type { SupportedTokens } from "./ui/ConnectWallet/defaultTokens.js";
export { defaultTokens } from "./ui/ConnectWallet/defaultTokens.js";

export { useSendSwap } from "./hooks/pay/useSendSwap.js";

export {
  useSwapRoute,
  type SwapRoute,
  type SwapRouteParams,
} from "./hooks/pay/useSwapRoute.js";

export {
  useSwapStatus,
  type SwapStatus,
  type SwapStatusParams,
} from "./hooks/pay/useSwapStatus.js";
