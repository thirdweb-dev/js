export { CoinbaseWallet } from "./wallets/wallets/coinbase-wallet";
export {
  MetaMaskWallet,
  RainbowWallet,
  TrustWallet,
} from "./wallets/wallets/all";

export { ConnectWallet } from "./components/ConnectWallet";
export { Web3Button } from "./components/Web3Button";

export { ChainId } from "@thirdweb-dev/sdk";

// providers
// export * from "./providers/full";
export * from "./providers/thirdweb-provider";

export {
  useActiveWallet,
  useAddress,
  useBalance,
  useChainId,
  useConnect,
  useConnectionStatus,
  useCreateWalletInstance,
  useDisconnect,
  useSupportedChains,
  useWallets,
} from "@thirdweb-dev/react-core";

// re-export everything from react-core
export * from "@thirdweb-dev/react-core/evm";
