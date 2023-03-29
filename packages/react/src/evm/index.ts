export { useSafe } from "./connectors/gnosis";

export { ConnectWallet } from "../wallet/ConnectWallet/ConnectWallet";

// UI components
export * from "./components/MediaRenderer";
export * from "./components/NftMedia";
export * from "./components/Web3Button";
export { ThirdwebProvider } from "./providers/thirdweb-provider";

// wallet/hooks
export { useInstalledWallets } from "../wallet/hooks/useInstalledWallets";
export { useIsNonLocalWallet as useWalletRequiresConfirmation } from "../wallet/hooks/useCanSwitchNetwork";

// wallet connection hooks
export { useMetamask } from "./hooks/wallets/useMetamask";
export { useCoinbaseWallet } from "./hooks/wallets/useCoinbaseWallet";

export {
  usePaperWalletUserEmail,
  usePaperWallet,
} from "./hooks/wallets/usePaper";

export {
  useWalletConnect,
  useWalletConnectV1,
} from "./hooks/wallets/useWalletConnect";

// react-core
export * from "@thirdweb-dev/react-core";
