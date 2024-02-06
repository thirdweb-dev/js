export { ConnectWallet } from "./ui/ConnectWallet/ConnectWallet.js";

export { ThirdwebProvider } from "./providers/thirdweb-provider.js";

export {
  useSetActiveWallet,
  useActiveWalletChainId,
  useConnect,
  useDisconnect,
  useActiveWallet,
  useConnectedWallets,
  useActiveWalletAddress,
  useSwitchActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSetActiveWalletConnectionStatus,
  useIsAutoConnecting,
} from "./providers/wallet-provider.js";

// contract related
export {
  useReadContract,
  createReadHook,
  // deprecated, use useReadContract instead
  useContractRead,
} from "./hooks/contract/useRead.js";
export { useSendTransaction } from "./hooks/contract/useSend.js";
export { useEstimateGas } from "./hooks/contract/useEstimate.js";
export { useWaitForReceipt } from "./hooks/contract/useWaitForReceipt.js";
export { useContractEvents } from "./hooks/contract/useContractEvents.js";

// rpc related
export { useBlockNumber } from "./hooks/rpc/useBlockNumber.js";
