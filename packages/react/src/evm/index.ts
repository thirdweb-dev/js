export {
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "./providers/wallet-ui-states-provider";

export { useSafe } from "./connectors/gnosis";
export { useMagic } from "./connectors/magic";

export {
  ConnectWallet,
  type ConnectWalletProps,
} from "../wallet/ConnectWallet/ConnectWallet";
export type { WelcomeScreen } from "../wallet/ConnectWallet/screens/types";
export { ConnectModalInline } from "../wallet/ConnectWallet/Modal/ConnectModalInline";

export {
  NetworkSelector,
  type NetworkSelectorProps,
  type NetworkSelectorChain,
} from "../wallet/ConnectWallet/NetworkSelector";

// UI components
export * from "./components/MediaRenderer";
export * from "./components/NftMedia";
export { Web3Button, type Web3ButtonProps } from "./components/Web3Button";
export {
  ThirdwebProvider,
  type DefaultChains,
  type ThirdwebProviderProps,
} from "./providers/thirdweb-provider";

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
  useEmbeddedWallet,
  useEmbeddedWalletUserEmail,
} from "./hooks/wallets/useEmbeddedWallet";
export { useEmbeddedWalletSendVerificationEmail } from "./hooks/useEmbeddedWalletSendVerificationEmail";

export {
  usePaperWalletUserEmail,
  usePaperWallet,
} from "./hooks/wallets/usePaper";

export {
  useWalletConnect,
  useWalletConnectV1,
} from "./hooks/wallets/useWalletConnect";

export {
  defaultTokens,
  type SupportedTokens,
} from "../wallet/ConnectWallet/defaultTokens";

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
  OKXWallet,
  TrustWallet,
  CoinbaseWallet,
  BloctoWallet,
  FrameWallet,
  PaperWallet,
  ZerionWallet,
  MagicLink,
  SignerWallet,
  InjectedWallet,
  setWalletAnalyticsEnabled,
  CoreWallet,
  CryptoDefiWallet,
  RabbyWallet,
  Coin98Wallet,
} from "@thirdweb-dev/wallets";
