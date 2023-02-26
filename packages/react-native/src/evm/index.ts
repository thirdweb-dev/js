export { ConnectWallet } from "./components/ConnectWallet";

export { ChainId } from "@thirdweb-dev/sdk";

// providers
// export * from "./providers/full";
export * from "./providers/thirdweb-provider";

// require to be inside `<ThirdwebProvider />`
export * from "./hooks/wagmi-required/useAccount";
export * from "./hooks/wagmi-required/useNetwork";
export * from "./hooks/connectors/useWalletConnect";

export { SupportedWallet } from './types/wallet';

export {
    useActiveWallet,
    useAddress,
    useBalance,
    useChainId,
    useConnect,
    useConnectingToWallet,
    useCreateWalletInstance,
    useDeviceWalletStorage,
    useDisconnect,
    useSupportedChains,
    useWallets,
    useDisplayUri,
} from "@thirdweb-dev/react-core";

// re-export everything from react-core
export * from "@thirdweb-dev/react-core/evm";