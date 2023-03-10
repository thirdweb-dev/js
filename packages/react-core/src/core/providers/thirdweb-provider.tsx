import { ThirdwebAuthConfig } from "../../evm/contexts/thirdweb-auth";
import {
  ThirdwebSDKProvider,
  ThirdwebSDKProviderProps,
} from "../../evm/providers/thirdweb-sdk-provider";
import { useWalletSigner } from "../hooks/wallet-hooks";
import { DAppMetaData } from "../types/dAppMeta";
import { SupportedWallet } from "../types/wallet";
import { showDeprecationWarning } from "../utils";
import { ThirdwebThemeContext } from "./theme-context";
import { ThirdwebWalletProvider } from "./thirdweb-wallet-provider";
import { QueryClient } from "@tanstack/react-query";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import type { SDKOptions } from "@thirdweb-dev/sdk";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { CreateAsyncStorage } from "@thirdweb-dev/wallets";
import React, { useMemo } from "react";

/**
 * The possible props for the ThirdwebProvider.
 */
export interface ThirdwebProviderCoreProps<
  TChains extends Chain[] = typeof defaultChains,
> {
  /**
   * The network to use for the SDK.
   */
  activeChain?: TChains[number]["chainId"] | TChains[number]["slug"] | Chain;

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
   * An array of wallets that the dApp supports
   * If not provided, will default to Metamask (injected), Coinbase wallet and Device wallet
   *
   * @example
   * You can Import the wallets you want to support from `@thirdweb-dev/wallets` and pass them to `supportedWallets`
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
   */
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
   * A partial map of chainIds to rpc urls to use for certain chains
   * If not provided, will default to the rpcUrls of the chain objects for the supported chains
   * @deprecated - use `chains` instead
   */
  chainRpc?: Record<number, string>;

  theme?: "light" | "dark";

  createWalletStorage: CreateAsyncStorage;
}

// SDK handles this under the hood for us

const defaultdAppMeta: DAppMetaData = {
  name: "thirdweb powered dApp",
  url: "https://thirdweb.com",
};

export const ThirdwebProviderCore = <
  TChains extends Chain[] = typeof defaultChains,
>(
  props: React.PropsWithChildren<ThirdwebProviderCoreProps<TChains>>,
) => {
  // deprecations
  if (props.chainRpc) {
    showDeprecationWarning("chainRpc", "supportedChains");
  }

  const supportedChains =
    props.supportedChains || (defaultChains as any as TChains);

  const dAppMeta = props.dAppMeta || defaultdAppMeta;
  const activeChainObj = useMemo(() => {
    if (!props.activeChain) {
      return supportedChains[0];
    }
    if (typeof props.activeChain === "number") {
      return (
        supportedChains.find((chain) => chain.chainId === props.activeChain) ||
        supportedChains[0]
      );
    }
    if (typeof props.activeChain === "string") {
      return (
        supportedChains.find((chain) => chain.slug === props.activeChain) ||
        supportedChains[0]
      );
    }

    return props.activeChain || supportedChains[0] || defaultChains[0];
  }, [props.activeChain, supportedChains]);

  return (
    <ThirdwebThemeContext.Provider value={props.theme}>
      <ThirdwebWalletProvider
        chains={supportedChains}
        supportedWallets={props.supportedWallets}
        shouldAutoConnect={props.autoConnect}
        createWalletStorage={props.createWalletStorage}
        dAppMeta={dAppMeta}
        activeChain={activeChainObj}
      >
        <ThirdwebSDKProviderWrapper
          queryClient={props.queryClient}
          sdkOptions={props.sdkOptions}
          supportedChains={supportedChains}
          activeChain={activeChainObj.chainId}
          storageInterface={props.storageInterface}
          authConfig={props.authConfig}
          thirdwebApiKey={props.thirdwebApiKey}
          alchemyApiKey={props.alchemyApiKey}
          infuraApiKey={props.infuraApiKey}
        >
          {props.children}
        </ThirdwebSDKProviderWrapper>
      </ThirdwebWalletProvider>
    </ThirdwebThemeContext.Provider>
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
