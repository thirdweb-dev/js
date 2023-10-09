export {
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "./providers/wallet-ui-states-provider";

export { useSafe } from "./connectors/gnosis";
export { useMagic } from "./connectors/magic";

export { ConnectWallet } from "../wallet/ConnectWallet/ConnectWallet";
export { ConnectModalInline } from "../wallet/ConnectWallet/Modal/ConnectModalInline";

export { NetworkSelector } from "../wallet/ConnectWallet/NetworkSelector";
export type { NetworkSelectorProps } from "../wallet/ConnectWallet/NetworkSelector";

// UI components
export * from "./components/MediaRenderer";
export * from "./components/NftMedia";
export * from "./components/Web3Button";
export { ThirdwebProvider } from "./providers/thirdweb-provider";

export type { MediaRendererProps } from "./components/types";

// wallet/hooks
export { useInstalledWallets } from "../wallet/hooks/useInstalledWallets";

// wallet connection hooks
export { useRainbowWallet } from "./hooks/wallets/useRainbowWallet";
export { useTrustWallet } from "./hooks/wallets/useTrustWallet";
export { useMetamask } from "./hooks/wallets/useMetamask";
export { useCoinbaseWallet } from "./hooks/wallets/useCoinbaseWallet";
export { useFrameWallet } from "./hooks/wallets/useFrame";
export { useBloctoWallet } from "./hooks/wallets/useBloctoWallet";

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
// wallets
export {
  LocalWallet,
  EmbeddedWallet,
  SmartWallet,
  SafeWallet,
  WalletConnect,
  PhantomWallet,
  RainbowWallet,
  MetaMaskWallet,
  TrustWallet,
  CoinbaseWallet,
  BloctoWallet,
  FrameWallet,
  PaperWallet,
  ZerionWallet,
  MagicLink,
  SignerWallet,
  InjectedWallet,
} from "@thirdweb-dev/wallets";
