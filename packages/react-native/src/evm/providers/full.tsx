import type { QueryClient } from '@tanstack/react-query';
import {
  ThirdwebSDKProvider,
  ThirdwebSDKProviderProps,
  ThirdwebConfigProvider,
  ThirdwebAuthConfig,
  SupportedChain,
  defaultSupportedChains,
  Chain,
} from '@thirdweb-dev/react-core';
import {
  DEFAULT_RPC_URLS,
  SDKOptions,
  getProviderForNetwork,
  SDKOptionsOutput,
} from '@thirdweb-dev/sdk';
import type { ThirdwebStorage } from '@thirdweb-dev/storage';
import React, { ReactNode, useMemo } from 'react';
import {
  Chain as WagmiChain,
  WagmiConfig,
  useProvider,
  Connector,
  createClient,
} from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { getDefaultProvider } from 'ethers';
import invariant from 'tiny-invariant';
import { getWagmiChain } from '../utils/chains';
import { TW_WC_PROJECT_ID, WC_RELAY_URL } from '../constants/walletConnect';

/**
 * @internal
 */
export type WalletConnectConnectorType =
  | WalletConnectConnector
  | 'walletConnect'
  | { name: 'walletConnect'; options: WalletConnectConnector['options'] };

/**
 * @internal
 */
export type WalletConnector = WalletConnectConnectorType;

/**
 * @internal
 */
export type ChainRpc<TSupportedChain extends SupportedChain> = Record<
  TSupportedChain extends Chain ? TSupportedChain['id'] : TSupportedChain,
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
  TSupportedChain extends SupportedChain = SupportedChain
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
    ? TSupportedChain['id']
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
}

// SDK handles this under the hood for us

const defaultdAppMeta: DAppMetaData = {
  name: 'thirdweb powered dApp',
};

const defaultWalletConnectors: Required<
  ThirdwebProviderProps['walletConnectors']
> = ['walletConnect'];

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
  TSupportedChain extends SupportedChain = SupportedChain
>({
  sdkOptions,
  chainRpc = DEFAULT_RPC_URLS,
  supportedChains = defaultSupportedChains.map(
    (c) => c.id
  ) as TSupportedChain[],
  walletConnectors = defaultWalletConnectors,
  dAppMeta = defaultdAppMeta,
  desiredChainId,
  authConfig,
  storageInterface,
  queryClient,
  children,
}: React.PropsWithChildren<ThirdwebProviderProps<TSupportedChain>>) => {
  // construct the wagmi options

  const _supportedChains: Chain[] = useMemo(() => {
    return supportedChains
      .map((c) => {
        if (typeof c === 'number') {
          return defaultSupportedChains.find((sc) => sc.id === c);
        }
        return c as Chain;
      })
      .filter((c) => c !== undefined) as Chain[];
  }, [supportedChains]);

  const _supportedWagmiChains = useMemo(() => {
    return supportedChains
      .map((c) => {
        if (typeof c === 'number') {
          const chain = defaultSupportedChains.find((sc) => sc.id === c);
          invariant(chain, `Invalid chainId: ${c}`);
          return getWagmiChain(chain);
        }

        return getWagmiChain(c);
      })
      .filter((c) => c !== undefined) as WagmiChain[];
  }, [supportedChains]);

  const _rpcUrlMap = useMemo(() => {
    return _supportedChains.reduce((prev, curr) => {
      invariant(curr.rpcUrls[0], 'No rpcUrls provided for chain')
      prev[curr.id] =
        curr.id in chainRpc
          ? (getProviderForNetwork(
              chainRpc[curr.id as keyof ChainRpc<TSupportedChain>] ||
                curr.rpcUrls[0],
            ) as string)
          : curr.rpcUrls[0];
      return prev;
    }, {} as Record<number, string>);
  }, [chainRpc, _supportedChains]);

  const _client = useMemo(() => {
    const walletConnectClientMeta = {
      name: dAppMeta.name,
      url: dAppMeta.url || '',
      icons: [dAppMeta.logoUrl || ''],
      description: dAppMeta.description || '',
    };

    const client = createClient({
      connectors: () => {
        return walletConnectors
          .map((connector) => {
            if (connector instanceof Connector) {
              return connector;
            }
            // wallet connect
            if (
              (typeof connector === 'string' &&
                connector === 'walletConnect') ||
              (typeof connector === 'object' &&
                connector.name === 'walletConnect')
            ) {
              return new WalletConnectConnector({
                chains: _supportedWagmiChains, // chains_,
                options:
                  typeof connector === 'string'
                    ? {
                        metadata: walletConnectClientMeta,
                        qrcode: false,
                        version: '2',
                        projectId: TW_WC_PROJECT_ID, // default project ID, feel free to update it in your .env file
                        relayUrl: WC_RELAY_URL,
                        logger: 'info',
                      }
                    : {
                        metadata: walletConnectClientMeta,
                        qrcode: false,
                        version: '2',
                        projectId: TW_WC_PROJECT_ID, // default project ID, feel free to update it in your .env file
                        relayUrl: WC_RELAY_URL,
                        logger: 'info',
                        ...connector.options,
                      },
              });
            }

            throw new Error(`Wallet connector not recognised: ${connector}`);
          })
          .filter((c) => c !== null);
      },
      provider: getDefaultProvider(),
    });

    return client;
  }, [
    dAppMeta.name,
    dAppMeta.url,
    dAppMeta.logoUrl,
    dAppMeta.description,
    walletConnectors,
    _supportedWagmiChains,
  ]);

  const readonlySettings: SDKOptionsOutput['readonlySettings'] = useMemo(() => {
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
      rpcUrl = getProviderForNetwork(rpcUrl!) as string;
    } catch (e) {
      console.error(
        `failed to configure rpc url for chain: "${desiredChainId}". Did you forget to pass "desiredChainId" to the <ThirdwebProvider /> component?`
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
        supportedChains: _supportedChains,
      }}
    >
      <WagmiConfig client={_client}>
        <ThirdwebSDKProviderWagmiWrapper
          queryClient={queryClient}
          desiredChainId={desiredChainId}
          sdkOptions={sdkOptionsWithDefaults}
          storageInterface={storageInterface}
          authConfig={authConfig}
        >
          {children}
        </ThirdwebSDKProviderWagmiWrapper>
      </WagmiConfig>
    </ThirdwebConfigProvider>
  );
};

const ThirdwebSDKProviderWagmiWrapper: React.FC<
  React.PropsWithChildren<Omit<ThirdwebSDKProviderProps, 'signer' | 'provider'>>
> = ({ children, ...props }) => {
  const provider = useProvider();
  return (
    <ThirdwebSDKProvider provider={provider} {...props}>
      {children as ReactNode}
    </ThirdwebSDKProvider>
  );
};
