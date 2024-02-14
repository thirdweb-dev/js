export { darkTheme, lightTheme } from "./ui/design-system/index.js";
export type { Theme, ThemeOverrides } from "./ui/design-system/index.js";

export { ConnectWallet } from "./ui/ConnectWallet/ConnectWallet.js";
export { ConnectEmbed } from "./ui/ConnectWallet/Modal/ConnectEmbed.js";

export type {
  ConnectWalletProps,
  ConnectWallet_ConnectButtonOptions,
  ConnectWallet_ConnectModalOptions,
  ConnectWallet_DetailsButtonOptions,
  ConnectWallet_DetailsModalOptions,
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
  useSetActiveAccount,
  useActiveWalletChainId,
  useConnect,
  useDisconnect,
  useActiveAccount,
  useConnectedAccounts,
  useSwitchActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSetActiveWalletConnectionStatus,
  useIsAutoConnecting,
} from "./providers/wallet-provider.js";

// contract related
export {
  useReadContract,
  // deprecated, use useReadContract instead
  useContractRead,
} from "./hooks/contract/useRead.js";
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
export { metamaskConfig } from "./wallets/metamask/metamaskConfig.js";
export { coinbaseConfig } from "./wallets/coinbase/coinbaseConfig.js";
export { rainbowConfig } from "./wallets/rainbow/rainbowConfig.js";
export { walletConnectConfig } from "./wallets/walletConnect/walletConnectConfig.js";
export { zerionConfig } from "./wallets/zerion/zerionConfig.js";

export type { SupportedTokens } from "./ui/ConnectWallet/defaultTokens.js";
export { defaultTokens } from "./ui/ConnectWallet/defaultTokens.js";
