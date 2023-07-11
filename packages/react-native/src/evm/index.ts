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
export { magicWallet } from "./wallets/wallets/magic-wallet";
export { MagicWallet } from "./wallets/wallets/MagicWallet";
export * from "./wallets/wallets/WalletConnectV2";
export type { WCMeta } from "./wallets/types/wc";

export { useCoinbaseWallet } from "./wallets/hooks/useCoinbaseWallet";
export { useMetaMaskWallet } from "./wallets/hooks/useMetaMaskWallet";
export { useRainbowWallet } from "./wallets/hooks/useRainbowWallet";
export { useTrustWallet } from "./wallets/hooks/useTrustWallet";

export { ConnectWallet } from "./components/ConnectWallet";
export { Web3Button } from "./components/Web3Button";

// utilities
export * from "./utils/uri";
export * from "./utils/addresses";
export { createSyncStorage as createLocalStorage } from "../core/AsyncStorage";
export { createAsyncLocalStorage } from "../core/AsyncStorage";
export { createSecureStorage } from "../core/SecureStorage";

// ui components
export * from "./components/base";

// assets / icons
export * from "./assets";

// providers
// export * from "./providers/full";
export * from "./providers/thirdweb-provider";

// re-export everything from react-core
export * from "@thirdweb-dev/react-core";
