import { ThirdwebAuthConfig } from "../../evm/contexts/thirdweb-auth";
import {
  ThirdwebSDKProvider,
  ThirdwebSDKProviderProps,
} from "../../evm/providers/thirdweb-sdk-provider";
import { DEFAULT_API_KEY } from "../constants/rpc";
import { DAppMetaData } from "../types/dAppMeta";
import { SupportedWallet } from "../types/wallet";
import { showDeprecationWarning } from "../utils";
import {
  ThirdwebWalletProvider,
  useWalletSigner,
} from "./thirdweb-wallet-provider";
// import { ThirdwebWalletProvider } from "./thirdweb-wallet-provider";
import { QueryClient } from "@tanstack/react-query";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import type { SDKOptions } from "@thirdweb-dev/sdk";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  CreateAsyncStorage,
  DeviceBrowserWallet,
  MetaMask,
} from "@thirdweb-dev/wallets";
import React, { useMemo } from "react";

// this allows autocomplete to work for the chainId prop but still allows `number` and `string` to be passed (for dynamically passed chain data)
type ChainIdIsh = (string | number) & { __chainIdIsh: never };

/**
 * The possible props for the ThirdwebProvider.
 */
export interface ThirdwebProviderProps<
  TChains extends Chain[] = typeof defaultChains,
> {
  /**
   * The network to use for the SDK.
   */
  activeChain?:
    | TChains[number]["chainId"]
    | TChains[number]["slug"]
    | Chain
    | ChainIdIsh;

  /**
   * Chains to support. If not provided, will default to the chains supported by the SDK.
   */
  supportedChains?: TChains;

  /**
   * The {@link SDKOptions | Thirdweb SDK Options} to pass to the thirdweb SDK
   * comes with sensible defaults
   */
  sdkOptions?: SDKOptions;
  /**
   * An array of connector types (strings) or wallet connector objects that the dApp supports
   * If not provided, will default to metamask (injected), wallet connect and walletlink (coinbase wallet) with sensible defaults
   */
  // walletConnectors?: WalletConnector[];

  // TODO
  supportedWallets: SupportedWallet[];

  /**
   * Metadata to pass to wallet connect and walletlink wallet connect. (Used to show *which* dApp is being connected to in mobile wallets that support it)
   * Defaults to just the name being passed as `thirdweb powered dApp`.
   */
  dAppMeta?: DAppMetaData;

  /**
   * The configuration used for thirdweb auth usage. Enables users to login
   * to backends with their wallet.
   */
  authConfig?: ThirdwebAuthConfig;

  /**
   * The storage interface to use with the sdk.
   */
  storageInterface?: ThirdwebStorage;

  /**
   * The react-query client to use. (Defaults to a default client.)
   */
  queryClient?: QueryClient;

  /**
   * Whether or not to attempt auto-connect to a wallet.
   */
  autoConnect?: boolean;

  // api keys that can be passed
  thirdwebApiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;

  /**
   * The chainId that your dApp is running on.
   * @deprecated - use `network` instead
   */
  desiredChainId?: number | undefined;
  /**
   * A partial map of chainIds to rpc urls to use for certain chains
   * If not provided, will default to the rpcUrls of the chain objects for the supported chains
   * @deprecated - use `chains` instead
   */
  chainRpc?: Record<number, string>;

  createWalletStorage: CreateAsyncStorage;
}

// SDK handles this under the hood for us

const defaultdAppMeta: DAppMetaData = {
  name: "thirdweb powered dApp",
};

// const defaultWalletConnectors: Required<
//   ThirdwebProviderProps["walletConnectors"]
// > = ["metamask", "walletConnect", "walletLink"];

/**
 *
 * The `<ThirdwebProvider />` component lets you control what networks you want users to connect to, what types of wallets can connect to your app, and the settings for the [Typescript SDK](https://docs.thirdweb.com/typescript).
 *
 * @example
 * You can wrap your application with the provider as follows:
 *
 * ```jsx title="App.jsx"
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider>
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 * ```
 *
 * @public
 *
 */
export const ThirdwebProvider = <
  TChains extends Chain[] = typeof defaultChains,
>({
  sdkOptions,

  // @ts-expect-error - different subtype of Chain[] but this works fine
  supportedChains = defaultChains,
  activeChain,

  // walletConnectors = defaultWalletConnectors,
  dAppMeta = defaultdAppMeta,

  authConfig,
  storageInterface,
  queryClient,
  autoConnect = true,
  children,

  thirdwebApiKey = DEFAULT_API_KEY,
  alchemyApiKey,
  infuraApiKey,

  supportedWallets = [MetaMask, DeviceBrowserWallet],

  // deprecated
  desiredChainId,
  chainRpc,
  createWalletStorage,
}: React.PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  // construct the wagmi options

  if (chainRpc) {
    showDeprecationWarning("chainRpc", "supportedChains");
  }
  if (desiredChainId) {
    showDeprecationWarning("desiredChainId", "activeChain");
  }

  const activeChainId = useMemo(() => {
    if (!activeChain) {
      return undefined;
    }
    if (typeof activeChain === "string" || typeof activeChain === "number") {
      return activeChain;
    }
    return activeChain.chainId;
  }, [activeChain]);

  const activeChainObj = useMemo(() => {
    if (typeof activeChain === "string") {
      return (
        supportedChains.find((chain) => chain.slug === activeChain) ||
        supportedChains[0] ||
        defaultChains[0]
      );
    }

    if (typeof activeChain === "number") {
      return (
        supportedChains.find((chain) => chain.chainId === activeChain) ||
        supportedChains[0] ||
        defaultChains[0]
      );
    }

    return activeChain || supportedChains[0] || defaultChains[0];
  }, [activeChain, supportedChains]);

  // handle auto connect

  return (
    <ThirdwebWalletProvider
      chains={supportedChains || defaultChains}
      wallets={supportedWallets}
      shouldAutoConnect={autoConnect}
      createWalletStorage={createWalletStorage}
      dAppMeta={dAppMeta}
      activeChain={activeChainObj}
    >
      <ThirdwebSDKProviderWrapper
        queryClient={queryClient}
        sdkOptions={sdkOptions}
        supportedChains={supportedChains}
        // desiredChainId is deprecated, we will remove it in the future but still need to pass it here for now
        activeChain={activeChainId || desiredChainId}
        storageInterface={storageInterface}
        authConfig={authConfig}
        thirdwebApiKey={thirdwebApiKey}
        alchemyApiKey={alchemyApiKey}
        infuraApiKey={infuraApiKey}
      >
        {children}
      </ThirdwebSDKProviderWrapper>
    </ThirdwebWalletProvider>
  );
};

const ThirdwebSDKProviderWrapper = <TChains extends Chain[]>({
  children,
  ...props
}: React.PropsWithChildren<
  Omit<ThirdwebSDKProviderProps<TChains>, "signer">
>) => {
  const signer = useWalletSigner();

  return (
    <ThirdwebSDKProvider signer={signer} {...props}>
      {children}
    </ThirdwebSDKProvider>
  );
};
