import { DEFAULT_API_KEY } from "../../core/constants";
import { showDeprecationWarning } from "../../core/utils";
import type { GnosisSafeConnector } from "../connectors/gnosis-safe";
import type { MagicConnector } from "../connectors/magic";
import { QueryClient } from "@tanstack/react-query";
import { Chain, defaultChains, getChainRPC } from "@thirdweb-dev/chains";
import {
  ThirdwebAuthConfig,
  ThirdwebSDKProvider,
  ThirdwebSDKProviderProps,
} from "@thirdweb-dev/react-core/evm";
import type { SDKOptions } from "@thirdweb-dev/sdk";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import React, { useMemo } from "react";
import {
  WagmiProvider,
  ProviderProps as WagmiproviderProps,
  useSigner,
  Connector,
  Chain as WagmiChain,
} from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

function transformChainToMinimalWagmiChain(chain: Chain): WagmiChain {
  return {
    id: chain.chainId,
    name: chain.name,
    rpcUrls: chain.rpc as string[],
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals as 18,
    },
    testnet: chain.testnet,
    blockExplorers: chain.explorers as Array<{
      name: string;
      url: string;
      standard: string;
    }>,
  };
}

/**
 * @internal
 */
export type InjectedConnectorType =
  | "injected"
  | "metamask"
  | { name: "injected" | "metamask"; options?: InjectedConnector["options"] };

/**
 * @internal
 */
export type WalletConnectConnectorType =
  | "walletConnect"
  | { name: "walletConnect"; options: WalletConnectConnector["options"] };

/**
 * @internal
 */
export type WalletLinkConnectorType =
  | "walletLink"
  | "coinbase"
  | {
      name: "walletLink" | "coinbase";
      options: CoinbaseWalletConnector["options"];
    };

/**
 * @internal
 */
export type WalletConnector =
  | InjectedConnectorType
  | WalletConnectConnectorType
  | WalletLinkConnectorType
  | GnosisSafeConnector
  | MagicConnector;

/**
 * the metadata to pass to wallet connection dialog (may show up during the wallet-connection process)
 * @remarks this is only used for wallet connect and wallet link, metamask does not support it
 * @public
 */
export interface DAppMetaData {
  /**
   * the name of your app
   */
  name: string;
  /**
   * optional - a description of your app
   */
  description?: string;
  /**
   * optional - a url that points to a logo (or favicon) of your app
   */
  logoUrl?: string;
  /**
   * the url where your app is hosted
   */
  url?: string;
  /**
   * optional - whether to show the connect dialog in darkmode or not
   */
  isDarkMode?: boolean;
}

/**
 * The possible props for the ThirdwebProvider.
 */
export interface ThirdwebProviderProps<
  TChains extends Chain[] = typeof defaultChains,
> {
  /**
   * The network to use for the SDK.
   */
  activeChain?: TChains[number]["chainId"] | TChains[number]["slug"] | Chain;

  /**
   * Chains to support. If not provided, will default to the chains supported by the SDK.
   */
  supportedChains?: Readonly<TChains>;

  /**
   * The {@link SDKOptions | Thirdweb SDK Options} to pass to the thirdweb SDK
   * comes with sensible defaults
   */
  sdkOptions?: SDKOptions;
  /**
   * An array of connector types (strings) or wallet connector objects that the dApp supports
   * If not provided, will default to metamask (injected), wallet connect and walletlink (coinbase wallet) with sensible defaults
   */
  walletConnectors?: WalletConnector[];

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
}

// SDK handles this under the hood for us

const defaultdAppMeta: DAppMetaData = {
  name: "thirdweb powered dApp",
};

const defaultWalletConnectors: Required<
  ThirdwebProviderProps["walletConnectors"]
> = ["metamask", "walletConnect", "walletLink"];

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

  walletConnectors = defaultWalletConnectors,
  dAppMeta = defaultdAppMeta,

  authConfig,
  storageInterface,
  queryClient,
  autoConnect = true,
  children,

  thirdwebApiKey = DEFAULT_API_KEY,
  alchemyApiKey,
  infuraApiKey,

  // deprecated
  desiredChainId,
  chainRpc,
}: React.PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  // construct the wagmi options

  if (chainRpc) {
    showDeprecationWarning("chainRpc", "supportedChains");
  }
  if (desiredChainId) {
    showDeprecationWarning("desiredChainId", "activeChain");
  }

  const mergedChains = useMemo(() => {
    if (
      !activeChain ||
      typeof activeChain === "string" ||
      typeof activeChain === "number"
    ) {
      return supportedChains as Readonly<Chain[]>;
    }
    return [...supportedChains, activeChain] as Readonly<Chain[]>;
  }, [supportedChains, activeChain]);

  const activeChainId = useMemo(() => {
    if (!activeChain) {
      return undefined;
    }
    if (typeof activeChain === "string" || typeof activeChain === "number") {
      return activeChain;
    }
    return activeChain.chainId;
  }, [activeChain]);

  const wagmiProps: WagmiproviderProps = useMemo(() => {
    const wagmiChains = mergedChains.map(transformChainToMinimalWagmiChain);

    const _rpcUrlMap = {
      ...mergedChains.reduce((acc, c) => {
        try {
          acc[c.chainId] = getChainRPC(c, {
            thirdwebApiKey,
            alchemyApiKey,
            infuraApiKey,
          });
        } catch (e) {
          //  just set it to an emptry string
          console.warn("No viable rpc url for chain: ", c.slug);
          acc[c.chainId] = "";
        }

        return acc;
      }, {} as Record<number, string>),
    };

    const walletConnectClientMeta = {
      name: dAppMeta.name,
      url: dAppMeta.url || "",
      icons: [dAppMeta.logoUrl || ""],
      description: dAppMeta.description || "",
    };

    const walletLinkClientMeta = {
      appName: dAppMeta.name,
      appLogoUrl: dAppMeta.logoUrl,
      darkMode: dAppMeta.isDarkMode,
    };

    return {
      autoConnect,
      connectorStorageKey: "tw:provider:connectors",
      connectors: ({ chainId }: { chainId?: number }) => {
        return walletConnectors
          .map((connector) => {
            if (connector instanceof Connector) {
              return connector;
            }
            // injected connector
            if (
              (typeof connector === "string" &&
                (connector === "injected" || connector === "metamask")) ||
              (typeof connector === "object" &&
                (connector.name === "injected" ||
                  connector.name === "metamask"))
            ) {
              return new InjectedConnector({
                options:
                  typeof connector === "string"
                    ? { shimDisconnect: true, shimChainChangedDisconnect: true }
                    : connector.options,
                chains: wagmiChains,
              });
            }
            if (
              (typeof connector === "string" &&
                connector === "walletConnect") ||
              (typeof connector === "object" &&
                connector.name === "walletConnect")
            ) {
              return new WalletConnectConnector({
                options:
                  typeof connector === "string"
                    ? {
                        chainId,
                        rpc: _rpcUrlMap,
                        clientMeta: walletConnectClientMeta,
                        qrcode: true,
                      }
                    : {
                        chainId,
                        rpc: _rpcUrlMap,
                        clientMeta: walletConnectClientMeta,
                        qrcode: true,
                        ...connector.options,
                      },
                chains: wagmiChains,
              });
            }
            if (
              (typeof connector === "string" &&
                (connector === "coinbase" || connector === "walletLink")) ||
              (typeof connector === "object" &&
                (connector.name === "coinbase" ||
                  connector.name === "walletLink"))
            ) {
              const jsonRpcUrl = _rpcUrlMap[chainId || 1];
              return new CoinbaseWalletConnector({
                chains: wagmiChains,
                options:
                  typeof connector === "string"
                    ? {
                        ...walletLinkClientMeta,
                        jsonRpcUrl,
                      }
                    : {
                        ...walletLinkClientMeta,
                        jsonRpcUrl,
                        ...connector.options,
                      },
              });
            }

            return null;
          })
          .filter((c) => c !== null);
      },
    } as WagmiproviderProps;
  }, [
    mergedChains,
    dAppMeta.name,
    dAppMeta.url,
    dAppMeta.logoUrl,
    dAppMeta.description,
    dAppMeta.isDarkMode,
    autoConnect,
    thirdwebApiKey,
    alchemyApiKey,
    infuraApiKey,
    walletConnectors,
  ]);

  return (
    <WagmiProvider {...wagmiProps}>
      <ThirdwebSDKProviderWagmiWrapper
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
      </ThirdwebSDKProviderWagmiWrapper>
    </WagmiProvider>
  );
};

const ThirdwebSDKProviderWagmiWrapper = <TChains extends Chain[]>({
  children,
  ...props
}: React.PropsWithChildren<
  Omit<ThirdwebSDKProviderProps<TChains>, "signer" | "provider">
>) => {
  const [signer] = useSigner();

  return (
    <ThirdwebSDKProvider signer={signer.data} {...props}>
      {children}
    </ThirdwebSDKProvider>
  );
};
