export { darkTheme, lightTheme } from "./styles/theme";
export type { Theme, ButtonTheme } from "./styles/theme";

export { coinbaseWallet } from "./wallets/wallets/coinbase-wallet";
export { metamaskWallet } from "./wallets/wallets/metamask-wallet";
export { rainbowWallet } from "./wallets/wallets/rainbow-wallet";
export { trustWallet } from "./wallets/wallets/trust-wallet";
export { deviceWallet } from "./wallets/wallets/device-wallet";
export { smartWallet } from "./wallets/wallets/smart-wallet";

export { useCoinbaseWallet } from "./wallets/hooks/useCoinbaseWallet";
export { useMetaMaskWallet } from "./wallets/hooks/useMetaMaskWallet";
export { useRainbowWallet } from "./wallets/hooks/useRainbowWallet";
export { useTrustWallet } from "./wallets/hooks/useTrustWallet";

export { ConnectWallet } from "./components/ConnectWallet";
export { Web3Button } from "./components/Web3Button";

// providers
// export * from "./providers/full";
export * from "./providers/thirdweb-provider";

// re-export everything from react-core
export * from "@thirdweb-dev/react-core";
