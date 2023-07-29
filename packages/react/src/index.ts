export { useSmartWallet } from "./evm/hooks/wallets/useSmartWallet";
export { localWallet } from "./wallet/wallets/localWallet/localWallet";
export { coinbaseWallet } from "./wallet/wallets/coinbase/coinbaseWallet";
export { frameWallet } from "./wallet/wallets/frame/frameWallet";
export { metamaskWallet } from "./wallet/wallets/metamask/metamaskWallet";
export { paperWallet } from "./wallet/wallets/paperWallet";
export { rainbowWallet } from "./wallet/wallets/rainbow/RainbowWallet";
export { safeWallet } from "./wallet/wallets/safe/safeWallet";
export { trustWallet } from "./wallet/wallets/trustWallet/TrustWallet";
export { walletConnect } from "./wallet/wallets/walletConnect";
export { walletConnectV1 } from "./wallet/wallets/walletConnectV1";
export { smartWallet } from "./wallet/wallets/smartWallet/smartWallet";
export { magicLink } from "./wallet/wallets/magic/magicLink";
export { zerionWallet } from "./wallet/wallets/zerion/zerionWallet";
export { bloctoWallet } from "./wallet/wallets/blocto/bloctoWallet";

export {
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "./evm/providers/wallet-ui-states-provider";

export { useSafe } from "./evm/connectors/gnosis";
export { useMagic } from "./evm/connectors/magic";

export { ConnectWallet } from "./wallet/ConnectWallet/ConnectWallet";
export { NetworkSelector } from "./wallet/ConnectWallet/NetworkSelector";
export type { NetworkSelectorProps } from "./wallet/ConnectWallet/NetworkSelector";

// UI components
export * from "./evm/components/MediaRenderer";
export * from "./evm/components/NftMedia";
export * from "./evm/components/Web3Button";
export { ThirdwebProvider } from "./evm/providers/thirdweb-provider";

// wallet/hooks
export { useInstalledWallets } from "./wallet/hooks/useInstalledWallets";

// wallet connection hooks
export { useRainbowWallet } from "./evm/hooks/wallets/useRainbowWallet";
export { useTrustWallet } from "./evm/hooks/wallets/useTrustWallet";
export { useMetamask } from "./evm/hooks/wallets/useMetamask";
export { useCoinbaseWallet } from "./evm/hooks/wallets/useCoinbaseWallet";
export { useFrameWallet } from "./evm/hooks/wallets/useFrame";

export {
  usePaperWalletUserEmail,
  usePaperWallet,
} from "./evm/hooks/wallets/usePaper";

export {
  useWalletConnect,
  useWalletConnectV1,
} from "./evm/hooks/wallets/useWalletConnect";

// react-core
export * from "@thirdweb-dev/react-core";
