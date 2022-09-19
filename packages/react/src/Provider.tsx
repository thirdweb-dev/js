import {
  GnosisConnectorArguments,
  GnosisSafeConnector,
} from "./connectors/gnosis-safe";
import { MagicConnector, MagicConnectorArguments } from "./connectors/magic";
import {
  Chain,
  SupportedChain,
  defaultSupportedChains,
} from "./constants/chain";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthConfigProvider,
} from "./contexts/thirdweb-auth";
import {
  ThirdwebConfigProvider,
  defaultChainRpc,
} from "./contexts/thirdweb-config";
import { useSigner } from "./hooks/useSigner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ChainOrRpc,
  SDKOptions,
  SUPPORTED_CHAIN_ID,
  SignerOrProvider,
  ThirdwebSDK,
  getProviderForNetwork,
  SDKOptionsOutput,
} from "@thirdweb-dev/sdk";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Signer } from "ethers";
import React, { createContext, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";
import {
  WagmiProvider,
  ProviderProps as WagmiproviderProps,
  useProvider,
} from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

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
export type MagicConnectorType =
  | "magic"
  | {
      name: "magic";
      options: Omit<MagicConnectorArguments, "network">;
    };

/**
 * @internal
 */
export type GnosisConnectorType =
  | "gnosis"
  | {
      name: "gnosis";
      options: GnosisConnectorArguments;
    };

/**
 * @internal
 */
export type WalletConnector =
  | InjectedConnectorType
  | WalletConnectConnectorType
  | WalletLinkConnectorType
  | MagicConnectorType
  | GnosisConnectorType;

/**
 * @internal
 */
export type ChainRpc<TSupportedChain extends SupportedChain> = Record<
  TSupportedChain extends Chain ? TSupportedChain["id"] : TSupportedChain,
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
export interface ThirdwebProviderProps<
  TSupportedChain extends SupportedChain = SupportedChain,
> {
  /**
   * The {@link SDKOptions | Thirdweb SDK Options} to pass to the thirdweb SDK
   * comes with sensible defaults
   */
  sdkOptions?: SDKOptions;
  /**
   * An array of chainIds or {@link Chain} objects that the dApp supports
   * If not provided, all chains supported by the SDK will be supported by default
   */
  supportedChains?: TSupportedChain[];
  /**
   * An array of connector types (strings) or wallet connector objects that the dApp supports
   * If not provided, will default to metamask (injected), wallet connect and walletlink (coinbase wallet) with sensible defaults
   */
  walletConnectors?: WalletConnector[];
  /**
   * A partial map of chainIds to rpc urls to use for certain chains
   * If not provided, will default to the rpcUrls of the chain objects for the supported chains
   */
  chainRpc?: Partial<ChainRpc<TSupportedChain>>;
  /**
   * Metadata to pass to wallet connect and walletlink wallet connect. (Used to show *which* dApp is being connected to in mobile wallets that support it)
   * Defaults to just the name being passed as `thirdweb powered dApp`.
   */
  dAppMeta?: DAppMetaData;
  /**
   * The chainId that your dApp is running on.
   * While this *can* be `undefined` it is required to be passed. Passing `undefined` will cause no SDK to be instantiated.
   * When passing a chainId, it **must** be part of the `supportedChains` array.
   */
  desiredChainId: TSupportedChain extends Chain
    ? TSupportedChain["id"]
    : TSupportedChain | undefined;

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
export const ThirdwebProvider = <
  TSupportedChain extends SupportedChain = SupportedChain,
>({
  sdkOptions,
  chainRpc = defaultChainRpc,
  supportedChains = defaultSupportedChains.map(
    (c) => c.id,
  ) as TSupportedChain[],
  walletConnectors = defaultWalletConnectors,
  dAppMeta = defaultdAppMeta,
  desiredChainId,
  authConfig,
  storageInterface,
  queryClient,
  autoConnect = true,
  children,
}: React.PropsWithChildren<ThirdwebProviderProps<TSupportedChain>>) => {
  // construct the wagmi options

  const _supporrtedChains = useMemo(() => {
    return supportedChains
      .map((c) => {
        if (typeof c === "number") {
          return defaultSupportedChains.find((sc) => sc.id === c);
        }
        return c as Chain;
      })
      .filter((c) => c !== undefined) as Chain[];
  }, [supportedChains]);

  const _rpcUrlMap = useMemo(() => {
    return _supporrtedChains.reduce((prev, curr) => {
      prev[curr.id] =
        curr.id in chainRpc
          ? (getProviderForNetwork(
              chainRpc[curr.id as keyof ChainRpc<TSupportedChain>] ||
                curr.rpcUrls[0],
            ) as string)
          : curr.rpcUrls[0];
      return prev;
    }, {} as Record<number, string>);
  }, [chainRpc, _supporrtedChains]);

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
                chains: _supporrtedChains,
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
                chains: _supporrtedChains,
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
                chains: _supporrtedChains,
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
            if (typeof connector === "object" && connector.name === "magic") {
              const jsonRpcUrl = _rpcUrlMap[chainId || desiredChainId || 1];
              return new MagicConnector({
                chains: _supporrtedChains,
                options: {
                  ...connector.options,
                  network: { rpcUrl: jsonRpcUrl, chainId: desiredChainId || 1 },
                  rpcUrls: _rpcUrlMap,
                },
              });
            }
            if (
              (typeof connector === "string" && connector === "gnosis") ||
              (typeof connector === "object" && connector.name === "gnosis")
            ) {
              return new GnosisSafeConnector({
                chains: _supporrtedChains,
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
    _supporrtedChains,
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
    try {
      rpcUrl = getProviderForNetwork(rpcUrl) as string;
    } catch (e) {
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
      ...opts,
      readonlySettings,
    };
  }, [sdkOptions, readonlySettings]);

  return (
    <ThirdwebConfigProvider
      value={{
        rpcUrlMap: _rpcUrlMap,
        supportedChains: _supporrtedChains,
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

export interface ThirdwebSDKProviderWagmiWrapper
  extends Pick<
    ThirdwebProviderProps,
    "desiredChainId" | "sdkOptions" | "storageInterface" | "authConfig"
  > {
  signer?: Signer;
  provider: ChainOrRpc | SignerOrProvider;
  queryClient?: QueryClient;
}

const ThirdwebSDKProviderWagmiWrapper: React.FC<
  React.PropsWithChildren<
    Omit<ThirdwebSDKProviderWagmiWrapper, "signer" | "provider">
  >
> = ({ children, ...props }) => {
  const provider = useProvider();
  const signer = useSigner();
  return (
    <ThirdwebSDKProvider signer={signer} provider={provider} {...props}>
      {children}
    </ThirdwebSDKProvider>
  );
};

interface SDKContext {
  sdk?: ThirdwebSDK;
  _inProvider?: true;
  desiredChainId: number;
}

const ThirdwebSDKContext = createContext<SDKContext>({ desiredChainId: -1 });

export interface ThirdwebSDKProviderProps
  extends Omit<ThirdwebSDKProviderWagmiWrapper, "queryClient"> {
  queryClient?: QueryClient;
}

/**
 * A barebones wrapper around the Thirdweb SDK.
 *
 * You can use this in order to be able to pass a provider & signer directly to the SDK.
 *
 * @remarks Utilizing this provider will mean hooks for wallet management are not available, if you need those please use the {@link ThirdwebProvider} instead.
 *
 * @beta
 */
export const ThirdwebSDKProvider: React.FC<
  React.PropsWithChildren<ThirdwebSDKProviderProps>
> = ({
  sdkOptions,
  desiredChainId,
  storageInterface,
  provider,
  signer,
  queryClient,
  authConfig,
  children,
}) => {
  const queryClientWithDefault: QueryClient = useMemo(() => {
    return queryClient ? queryClient : new QueryClient();
  }, [queryClient]);

  const sdk = useMemo(() => {
    if (!desiredChainId || typeof window === "undefined") {
      return undefined;
    }
    const _sdk = new ThirdwebSDK(provider, sdkOptions, storageInterface);
    (_sdk as any)._constructedAt = Date.now();
    (_sdk as any)._chainId = desiredChainId;
    return _sdk;
  }, [provider, sdkOptions, storageInterface, desiredChainId]);

  useEffect(() => {
    if (signer && sdk && (sdk as any)._chainId === desiredChainId) {
      sdk.updateSignerOrProvider(signer);
    }
  }, [signer, sdk, desiredChainId]);

  const ctxValue = useMemo(
    () => ({
      sdk,
      desiredChainId: desiredChainId || -1,
      _inProvider: true as const,
    }),
    [desiredChainId, sdk],
  );

  return (
    <ThirdwebAuthConfigProvider value={authConfig}>
      <QueryClientProvider client={queryClientWithDefault}>
        <ThirdwebSDKContext.Provider value={ctxValue}>
          {children}
        </ThirdwebSDKContext.Provider>
      </QueryClientProvider>
    </ThirdwebAuthConfigProvider>
  );
};

/**
 * @internal
 */
function useSDKContext(): SDKContext {
  const ctx = React.useContext(ThirdwebSDKContext);
  invariant(
    ctx._inProvider,
    "useSDK must be called from within a ThirdwebProvider, did you forget to wrap your app in a <ThirdwebProvider />?",
  );
  return ctx;
}

/**
 *
 * @returns {@link ThirdwebSDK}
 * Access the instance of the thirdweb SDK created by the ThirdwebProvider
 * to call methods using the connected wallet on the desiredChainId.
 * @example
 * ```javascript
 * const sdk = useSDK();
 * ```
 */
export function useSDK(): ThirdwebSDK | undefined {
  const { sdk } = useSDKContext();
  return sdk;
}

/**
 * @internal
 */
export function useDesiredChainId(): number {
  const { desiredChainId } = useSDKContext();
  return desiredChainId;
}

/**
 * @internal
 */
export function useActiveChainId(): SUPPORTED_CHAIN_ID | undefined {
  const sdk = useSDK();
  return (sdk as any)?._chainId;
}

/**
 * @internal
 */
export function useActiveSigner(): Signer | undefined {
  const sdk = useSDK();
  const [signer, setSigner] = useState<Signer | undefined>(sdk?.getSigner());
  useEffect(() => {
    if (sdk) {
      sdk.wallet.events.on("signerChanged", (newSigner: Signer | undefined) => {
        setSigner(newSigner);
      });
      return () => {
        sdk.wallet.events.off("signerChanged");
      };
    }
  }, [sdk]);
  return signer;
}

/**
 * @internal
 */
export function useActiveSignerAddress(): string | undefined {
  const signer = useActiveSigner();
  const [address, setAddress] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (signer) {
      signer.getAddress().then((a) => {
        setAddress(a);
      });
    }
  }, [signer]);
  return address;
}

/**
 * @internal
 */
export function useActiveSignerChainId(): number | undefined {
  const signer = useActiveSigner();
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (signer) {
      signer.getChainId().then((id) => {
        setChainId(id);
      });
    }
  }, [signer]);
  return chainId;
}
