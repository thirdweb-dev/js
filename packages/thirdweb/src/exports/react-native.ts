// export {
//   ThirdwebProvider,
//   type ThirdwebProviderProps,
// } from "../react/mobile/providers/thirdweb-provider.js";

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
