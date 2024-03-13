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
} from "../react/hooks/wallets/wallet-hooks.js";

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
export { useInvalidateContractQuery } from "../react/hooks/others/useInvalidateQueries.js";

export type { SupportedTokens } from "../react-ui/ui/ConnectWallet/defaultTokens.js";
export { defaultTokens } from "../react-ui/ui/ConnectWallet/defaultTokens.js";

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

export { defaultWallets } from "../react-ui/wallets/defaultWallets.js";

export { en } from "../react-ui/ui/locales/en.js";
export { es } from "../react-ui/ui/locales/es.js";
export { ja } from "../react-ui/ui/locales/ja.js";
export { tl } from "../react-ui/ui/locales/tl.js";
export type { ThirdwebLocale } from "../react-ui/ui/locales/types.js";
