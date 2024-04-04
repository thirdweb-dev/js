export { ThirdwebProvider } from "../react/core/providers/thirdweb-provider.js";

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
export { useReadContract } from "../react/core/hooks/contract/useReadContract.js";
export { useSendTransaction } from "../react/core/hooks/contract/useSendTransaction.js";
export { useEstimateGas } from "../react/core/hooks/contract/useEstimateGas.js";
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

// Buy with crypto
export {
  useBuyWithCryptoQuote,
  type BuyWithCryptoQuoteQueryParams,
} from "../react/core/hooks/pay/useBuyWithCryptoQuote.js";
export {
  useBuyWithCryptoStatus,
  type BuyWithCryptoStatusQueryParams,
} from "../react/core/hooks/pay/useBuyWithCryptoStatus.js";
export {
  useBuyWithCryptoHistory,
  type BuyWithCryptoHistoryQueryParams,
} from "../react/core/hooks/pay/useBuyWithCryptoHistory.js";
