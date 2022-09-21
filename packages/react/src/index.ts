// define `__DEV__` as global variable
// eslint-disable-next-line turbo/no-undeclared-env-vars
__DEV__ = process.env.NODE_ENV !== "production";

// providers
export * from "./providers/base";
export * from "./providers/full";

// contract hooks
export * from "./hooks/contracts";
// async contract hooks
export * from "./hooks/async/contracts";
export * from "./hooks/async/nft";
export * from "./hooks/async/drop";
export * from "./hooks/async/marketplace";
export * from "./hooks/async/token";
export * from "./hooks/async/claim-conditions";
export * from "./hooks/async/wallet";
export * from "./hooks/async/contract-settings";
export * from "./hooks/async/roles";

// thirdweb hooks (work as long as at least `<ThirdwebSDkProvider>` is used)
export * from "./hooks/auth";
export * from "./hooks/useSigner";
export * from "./hooks/useAddress";
export * from "./hooks/useReadonlySDK";
export * from "./hooks/useChainId";
export * from "./hooks/useNetworkMismatch";

// require to be inside `<ThirdwebProvider />`
export * from "./hooks/wagmi-required/useNetwork";
export * from "./hooks/wagmi-required/useDisconnect";
export * from "./hooks/wagmi-required/useConnect";
export * from "./hooks/connectors/useMetamask";
export * from "./hooks/connectors/useWalletConnect";
export * from "./hooks/connectors/useWalletLink";
export * from "./hooks/connectors/useGnosis";
export * from "./hooks/connectors/useMagic";

// re-exports
export { ChainId } from "@thirdweb-dev/sdk";

// types
export * from "./types";
export type { ThirdwebAuthConfig } from "./contexts/thirdweb-auth";

// ui components
export * from "./components/MediaRenderer";
export * from "./components/NftMedia";
export * from "./components/ConnectWallet";
export * from "./components/Web3Button";
