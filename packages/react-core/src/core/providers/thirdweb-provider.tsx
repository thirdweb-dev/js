import { ThirdwebAuthConfig } from "../../evm/contexts/thirdweb-auth";
import {
  ThirdwebSDKProvider,
  ThirdwebSDKProviderProps,
} from "../../evm/providers/thirdweb-sdk-provider";
import { DAppMetaData } from "../types/dAppMeta";
import { SupportedWallet } from "../types/wallet";
import { updateChainRPCs } from "../utils/updateChainRpcs";
import { ThirdwebThemeContext } from "./theme-context";
import {
  ThirdwebWalletProvider,
  useThirdwebWallet,
} from "./thirdweb-wallet-provider";
import { QueryClient } from "@tanstack/react-query";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import type { SDKOptions } from "@thirdweb-dev/sdk";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { CreateAsyncStorage } from "@thirdweb-dev/wallets";
import React, { useMemo } from "react";
import { useUpdateChainsWithApiKeys } from "../hooks/chain-hooks";

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

  theme?: "light" | "dark";

  createWalletStorage: CreateAsyncStorage;

  /**
   * Whether or not to automatically switch to wallet's network to active chain
   */
  autoSwitch?: boolean;
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
  const supportedChains_ =
    props.supportedChains || (defaultChains as any as TChains);
  const activeChainObj = useMemo(() => {
    if (typeof props.activeChain === "number") {
      return supportedChains_.find(
        (chain) => chain.chainId === props.activeChain,
      );
    }
    if (typeof props.activeChain === "string") {
      return supportedChains_.find((chain) => chain.slug === props.activeChain);
    }

    return props.activeChain;
  }, [props.activeChain]);

  const [_supportedChains, _activeChain] = useUpdateChainsWithApiKeys(
    // @ts-expect-error - different subtype of Chain[] but this works fine
    supportedChains_,
    activeChainObj,
    props.thirdwebApiKey,
    props.alchemyApiKey,
    props.infuraApiKey,
  );

  const dAppMeta = props.dAppMeta || defaultdAppMeta;
  return (
    <ThirdwebThemeContext.Provider value={props.theme}>
      <ThirdwebWalletProvider
        chains={_supportedChains}
        supportedWallets={props.supportedWallets}
        shouldAutoConnect={props.autoConnect}
        createWalletStorage={props.createWalletStorage}
        dAppMeta={dAppMeta}
        activeChain={activeChainObj}
        autoSwitch={props.autoSwitch}
      >
        <ThirdwebSDKProviderWrapper
          queryClient={props.queryClient}
          sdkOptions={props.sdkOptions}
          supportedChains={_supportedChains}
          activeChain={activeChainObj}
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
  const signer = useThirdwebWallet()?.signer;

  return (
    <ThirdwebSDKProvider signer={signer} {...props}>
      {children}
    </ThirdwebSDKProvider>
  );
};
