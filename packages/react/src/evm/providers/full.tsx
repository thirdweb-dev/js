import type { GnosisSafeConnector } from "../connectors/gnosis-safe";
import type { MagicConnector } from "../connectors/magic";
import { ThirdwebAuthConfig } from "../contexts/thirdweb-auth";
import { ThirdwebConfigProvider } from "../contexts/thirdweb-config";
import { ThirdwebSDKProvider, ThirdwebSDKProviderProps } from "./base";
import { QueryClient } from "@tanstack/react-query";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { SDKOptions, SDKOptionsOutput } from "@thirdweb-dev/sdk";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import React, { useMemo } from "react";
import {
  WagmiProvider,
  ProviderProps as WagmiproviderProps,
  useProvider,
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
    rpcUrls: chain.rpc,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals as 18,
    },
    testnet: chain.testnet,
    blockExplorers: chain.explorers,
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
 * @internal
 */
export type ChainRpc<TSupportedChain extends Chain> = Record<
  TSupportedChain extends Chain ? TSupportedChain["chainId"] : TSupportedChain,
  string
>;
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
   * optional - the url where your app is hosted
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
export interface ThirdwebProviderProps {
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
   * A partial map of chainIds to rpc urls to use for certain chains
   * If not provided, will default to the rpcUrls of the chain objects for the supported chains
   * @deprecated - use `chains` instead
   */
  chainRpc?: Record<number, string>;
  /**
   * Metadata to pass to wallet connect and walletlink wallet connect. (Used to show *which* dApp is being connected to in mobile wallets that support it)
   * Defaults to just the name being passed as `thirdweb powered dApp`.
   */
  dAppMeta?: DAppMetaData;
  /**
   * The chainId that your dApp is running on.
   * While this *can* be `undefined` it is required to be passed. Passing `undefined` will cause no SDK to be instantiated
   */
  desiredChainId: number | undefined;

  /**
   * The configuration used for thirdweb auth usage. Enables users to login
   * to backends with their wallet.
   * @beta
   */
  authConfig?: ThirdwebAuthConfig;

  /**
   * The storage interface to use with the sdk.
   */
  storageInterface?: ThirdwebStorage;

  /**
   * The react-query client to use. (Defaults to a default client.)
   * @beta
   */
  queryClient?: QueryClient;

  /**
   * Whether or not to attempt auto-connect to a wallet.
   */
  autoConnect?: boolean;

  /**
   * Chains to support. If not provided, will default to the chains supported by the SDK.
   */
  chains?: Chain[];
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
 * import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider desiredChainId={ChainId.Mainnet}>
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 * ```
 *
 * @public
 *
 */
export const ThirdwebProvider = ({
  sdkOptions,
  chains = defaultChains,
  chainRpc = chains.reduce((acc, c) => {
    acc[c.chainId] = c.rpc[0];
    return acc;
  }, {} as Record<number, string>),
  walletConnectors = defaultWalletConnectors,
  dAppMeta = defaultdAppMeta,
  desiredChainId,
  authConfig,
  storageInterface,
  queryClient,
  autoConnect = true,
  children,
}: React.PropsWithChildren<ThirdwebProviderProps>) => {
  // construct the wagmi options

  const _rpcUrlMap: Record<number, string> = useMemo(() => {
    return {
      ...chains.reduce((acc, c) => {
        acc[c.chainId] = c.rpc[0];
        return acc;
      }, {} as Record<number, string>),
      ...chainRpc,
    };
  }, [chainRpc, chains]);

  const wagmiChains = useMemo(() => {
    return chains.map(transformChainToMinimalWagmiChain);
  }, [chains]);

  const wagmiProps: WagmiproviderProps = useMemo(() => {
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
              const jsonRpcUrl = _rpcUrlMap[chainId || desiredChainId || 1];
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
    dAppMeta.name,
    dAppMeta.url,
    dAppMeta.logoUrl,
    dAppMeta.description,
    dAppMeta.isDarkMode,
    autoConnect,
    walletConnectors,
    wagmiChains,
    _rpcUrlMap,
    desiredChainId,
  ]);

  const readonlySettings: SDKOptionsOutput["readonlySettings"] = useMemo(() => {
    if (
      sdkOptions?.readonlySettings?.rpcUrl &&
      sdkOptions?.readonlySettings?.chainId
    ) {
      return sdkOptions.readonlySettings;
    }
    if (!desiredChainId) {
      return undefined;
    }
    let rpcUrl = _rpcUrlMap[desiredChainId as keyof typeof _rpcUrlMap];
    if (!rpcUrl) {
      console.error(
        `failed to configure rpc url for chain: "${desiredChainId}". Did you forget to pass "desiredChainId" to the <ThirdwebProvider /> component?`,
      );
      // cannot set readonly without a valid rpc url
      return undefined;
    }
    return {
      chainId: desiredChainId,
      rpcUrl,
    };
  }, [_rpcUrlMap, desiredChainId, sdkOptions?.readonlySettings]);

  const sdkOptionsWithDefaults = useMemo(() => {
    const opts: SDKOptions = sdkOptions;
    return {
      readonlySettings,
      chainInfos: chains,
      ...opts,
    };
  }, [sdkOptions, readonlySettings, chains]);

  return (
    <ThirdwebConfigProvider
      value={{
        rpcUrlMap: _rpcUrlMap,
        chains,
      }}
    >
      <WagmiProvider {...wagmiProps}>
        <ThirdwebSDKProviderWagmiWrapper
          queryClient={queryClient}
          desiredChainId={desiredChainId}
          sdkOptions={sdkOptionsWithDefaults}
          storageInterface={storageInterface}
          authConfig={authConfig}
        >
          {children}
        </ThirdwebSDKProviderWagmiWrapper>
      </WagmiProvider>
    </ThirdwebConfigProvider>
  );
};

const ThirdwebSDKProviderWagmiWrapper: React.FC<
  React.PropsWithChildren<Omit<ThirdwebSDKProviderProps, "signer" | "provider">>
> = ({ children, ...props }) => {
  const provider = useProvider();
  const [signer] = useSigner();
  return (
    <ThirdwebSDKProvider signer={signer.data} provider={provider} {...props}>
      {children}
    </ThirdwebSDKProvider>
  );
};
