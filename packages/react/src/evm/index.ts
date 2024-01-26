export {
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
  type ModalConfigOptions,
  useSetWalletModalConfig,
} from "./providers/wallet-ui-states-provider";

export { useSafe } from "./connectors/gnosis";
export { useMagic } from "./connectors/magic";

export {
  ConnectWallet,
  type ConnectWalletProps,
} from "../wallet/ConnectWallet/ConnectWallet";
export type { WelcomeScreen } from "../wallet/ConnectWallet/screens/types";
export {
  ConnectModalInline,
  type ConnectModalInlineProps,
} from "../wallet/ConnectWallet/Modal/ConnectModalInline";

export {
  useShowConnectEmbed,
  ConnectEmbed,
  type ConnectEmbedProps,
} from "../wallet/ConnectWallet/Modal/ConnectEmbed";

export {
  NetworkSelector,
  type NetworkSelectorProps,
  type NetworkSelectorChainProps,
} from "../wallet/ConnectWallet/NetworkSelector";

// UI components
export * from "./components/MediaRenderer";
export * from "./components/NftMedia";
export {
  Web3Button,
  type Web3ButtonProps,
  type ActionFn,
} from "./components/Web3Button";
export {
  ThirdwebProvider,
  type DefaultChains,
  type ThirdwebProviderProps,
} from "./providers/thirdweb-provider";
export { NFTSearcher } from "./components/NFTSearcher";

export type { MediaRendererProps, SharedMediaProps } from "./components/types";

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

export {
  oneKeyWallet,
  type OneKeyWalletConfigOptions,
} from "../wallet/wallets/oneKey/oneKeyWallet";

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
  OneKeyWallet,
  CryptoDefiWallet,
  RabbyWallet,
  Coin98Wallet,
} from "@thirdweb-dev/wallets";
