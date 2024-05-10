export { darkTheme, lightTheme } from "../react/web/ui/design-system/index.js";
export type {
  Theme,
  ThemeOverrides,
} from "../react/web/ui/design-system/index.js";

export { ConnectButton } from "../react/web/ui/ConnectWallet/ConnectButton.js";
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
} from "../react/web/ui/ConnectWallet/ConnectButtonProps.js";
export type { NetworkSelectorProps } from "../react/web/ui/ConnectWallet/NetworkSelector.js";
export type { WelcomeScreen } from "../react/web/ui/ConnectWallet/screens/types.js";
export type { LocaleId } from "../react/web/ui/types.js";

export {
  TransactionButton,
  type TransactionButtonProps,
} from "../react/web/ui/TransactionButton/index.js";

export { ThirdwebProvider } from "../react/core/providers/thirdweb-provider.js";

// tokens
export type {
  SupportedTokens,
  TokenInfo,
} from "../react/web/ui/ConnectWallet/defaultTokens.js";
export { defaultTokens } from "../react/web/ui/ConnectWallet/defaultTokens.js";

// Media Renderer
export { MediaRenderer } from "../react/web/ui/MediaRenderer/MediaRenderer.js";
export type { MediaRendererProps } from "../react/web/ui/MediaRenderer/types.js";

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

export type { ConnectManagerOptions } from "../wallets/manager/index.js";

// contract related
export { useReadContract } from "../react/core/hooks/contract/useReadContract.js";
export {
  useSendTransaction,
  type SendTransactionConfig,
  type SendTransactionPayModalConfig,
} from "../react/web/hooks/useSendTransaction.js";
export { useSendBatchTransaction } from "../react/core/hooks/contract/useSendBatchTransaction.js";
export { useSendAndConfirmTransaction } from "../react/core/hooks/contract/useSendAndConfirmTransaction.js";
export { useEstimateGas } from "../react/core/hooks/contract/useEstimateGas.js";
export { useEstimateGasCost } from "../react/core/hooks/contract/useEstimateGasCost.js";
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

// pay
export {
  useBuyWithCryptoQuote,
  type BuyWithCryptoQuoteQueryOptions,
} from "../react/core/hooks/pay/useBuyWithCryptoQuote.js";
export { useBuyWithCryptoStatus } from "../react/core/hooks/pay/useBuyWithCryptoStatus.js";
export {
  useBuyWithCryptoHistory,
  type BuyWithCryptoHistoryQueryOptions,
} from "../react/core/hooks/pay/useBuyWithCryptoHistory.js";
export {
  useBuyWithFiatQuote,
  type BuyWithFiatQuoteQueryOptions,
} from "../react/core/hooks/pay/useBuyWithFiatQuote.js";
export { useBuyWithFiatStatus } from "../react/core/hooks/pay/useBuyWithFiatStatus.js";
export {
  useBuyWithFiatHistory,
  type BuyWithFiatHistoryQueryOptions,
} from "../react/core/hooks/pay/useBuyWithFiatHistory.js";
export {
  useBuyHistory,
  type BuyHistoryQueryOptions,
} from "../react/core/hooks/pay/useBuyHistory.js";
export {
  usePostOnRampQuote,
  type PostOnRampQuoteQueryOptions,
} from "../react/core/hooks/pay/usePostOnrampQuote.js";

export {
  AutoConnect,
  type AutoConnectProps,
} from "../react/core/hooks/connection/useAutoConnect.js";

// auth
export { type SiweAuthOptions } from "../react/core/hooks/auth/useSiweAuth.js";

export {
  PayEmbed,
  type PayEmbedProps,
  type PayEmbedConnectOptions,
} from "../react/web/ui/PayEmbed.js";
export type { PayUIOptions } from "../react/web/ui/ConnectWallet/ConnectButtonProps.js";
