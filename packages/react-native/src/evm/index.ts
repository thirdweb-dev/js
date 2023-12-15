export { darkTheme, lightTheme } from "./styles/theme";
export type { Theme, ButtonTheme } from "./styles/theme";
export { useAppTheme } from "./styles/hooks";

export {
  CoinbaseWallet,
  coinbaseWallet,
} from "./wallets/wallets/coinbase-wallet";
export {
  MetaMaskWallet,
  metamaskWallet,
} from "./wallets/wallets/metamask-wallet";
export { RainbowWallet, rainbowWallet } from "./wallets/wallets/rainbow-wallet";
export { TrustWallet, trustWallet } from "./wallets/wallets/trust-wallet";
export { smartWallet } from "./wallets/wallets/smart-wallet";
export { localWallet } from "./wallets/wallets/local-wallet";
export { LocalWallet } from "./wallets/wallets/LocalWallet";
export { magicWallet } from "./wallets/wallets/magic-link";
export { MagicWallet } from "./wallets/wallets/MagicLink";
export { MagicLink } from "./wallets/wallets/MagicLink";
export { magicLink } from "./wallets/wallets/magic-link";
export { EmbeddedWallet } from "./wallets/wallets/embedded/EmbeddedWallet";
export { embeddedWallet } from "./wallets/wallets/embedded/embedded-wallet";
export * from "./wallets/wallets/wallet-connect/WalletConnectBase";
export { WalletConnect } from "./wallets/wallets/wallet-connect/WalletConnect";
export { walletConnect } from "./wallets/wallets/wallet-connect/wallet-connect";
export type { WCMeta } from "./wallets/types/wc";

export { useCoinbaseWallet } from "./wallets/hooks/useCoinbaseWallet";
export { useMetaMaskWallet } from "./wallets/hooks/useMetaMaskWallet";
export { useRainbowWallet } from "./wallets/hooks/useRainbowWallet";
export { useTrustWallet } from "./wallets/hooks/useTrustWallet";
export { useEmbeddedWallet } from "./wallets/hooks/useEmbeddedWallet";
export { useSmartWallet } from "./wallets/hooks/useSmartWallet";
export { useEmbeddedWalletSendVerificationEmail } from "./wallets/hooks/useEmbeddedWalletSendVerificationEmail";

export {
  ConnectWallet,
  type ConnectWalletProps,
} from "./components/ConnectWallet";
export { Web3Button, type ActionFn } from "./components/Web3Button";

export { WalletConnectUI } from "./wallets/wallets/wallet-connect/WalletConnectUI";

// utilities
export * from "./utils/uri";
export { createSyncStorage as createLocalStorage } from "../core/AsyncStorage";
export { createAsyncLocalStorage } from "../core/AsyncStorage";
export { createSecureStorage } from "../core/SecureStorage";
export { ThirdwebStorage } from "../core/storage/storage";

export * from "./i18n/strings";
export * from "./i18n/types";

// ui components
export * from "./components/base";
/**
 * @internal
 */
export { ConnectWalletHeader } from "./components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";

// assets / icons
export * from "./assets";

// providers
// export * from "./providers/full";
export * from "./providers/thirdweb-provider";

// re-export everything from react-core
export * from "@thirdweb-dev/react-core";

// ThirdwebSDK RN
export { ThirdwebSDK } from "./sdk/ThirdwebSDK";
