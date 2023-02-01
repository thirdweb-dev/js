// providers
export * from "./providers/full";

// require to be inside `<ThirdwebProvider />`
export * from "./hooks/wagmi-required/useAccount";
export * from "./hooks/wagmi-required/useNetwork";
export * from "./hooks/wagmi-required/useDisconnect";
export * from "./hooks/wagmi-required/useConnect";
export * from "./hooks/connectors/useMetamask";
export * from "./hooks/connectors/useWalletConnect";
export * from "./hooks/connectors/useWalletLink";

// re-exports
export { ChainId } from "@thirdweb-dev/sdk";

// types
export * from "./types";

export type { ThirdwebAuthConfig } from "./contexts/thirdweb-auth";