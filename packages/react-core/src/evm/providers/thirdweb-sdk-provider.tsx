import { useMemo, useEffect } from "react";
import { QueryClientProviderWithDefault } from "../../core/providers/query-client";
import { ThirdwebConfigProvider } from "../contexts/thirdweb-config";
import { ThirdwebSDKContext } from "../contexts/thirdweb-sdk";
import { ThirdwebConnectedWalletProvider } from "../contexts/thirdweb-wallet";
import { useUpdateChainsWithClientId } from "../hooks/chain-hooks";
import { ThirdwebSDKProviderProps } from "./types";
import { Chain, defaultChains, getValidChainRPCs } from "@thirdweb-dev/chains";
import { SDKOptionsOutput, ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { checkClientIdOrSecretKey } from "@thirdweb-dev/sdk";

/**
 *
 * @internal
 */
const WrappedThirdwebSDKProvider = <TChains extends Chain[]>({
  sdkOptions = {},
  storageInterface,
  supportedChains,
  activeChain,
  signer,
  children,
  clientId,
  secretKey,
}: React.PropsWithChildren<
  { supportedChains: Readonly<TChains> } & Omit<
    ThirdwebSDKProviderProps<TChains>,
    "authConfig" | "supportedChains"
  >
>) => {
  const activeChainId = useMemo(() => {
    if (!activeChain) {
      return supportedChains[0]?.chainId;
    }
    if (typeof activeChain === "number") {
      return activeChain;
    }
    if (typeof activeChain === "string") {
      return supportedChains.find((c) => c.slug === activeChain)?.chainId;
    }
    return activeChain.chainId;
  }, [activeChain, supportedChains]);

  const sdk = useMemo(() => {
    // on the server we can't do anything (?)
    if (typeof window === "undefined") {
      return undefined;
    }
    let chainId = activeChainId;

    const supportedChain = supportedChains.find((c) => c.chainId === chainId);

    if (!supportedChain && chainId !== undefined) {
      console.warn(
        `The chainId ${chainId} is not in the configured chains, please add it to the ThirdwebProvider`,
      );
      // reset the chainId as to not trigger an error in the sdk constructor
      chainId = undefined;
    }

    let readonlySettings: SDKOptionsOutput["readonlySettings"] = undefined;

    if (supportedChain && supportedChain.rpc.length > 0) {
      try {
        const rpcUrl = getValidChainRPCs(supportedChain, clientId)[0];

        readonlySettings = {
          chainId: supportedChain.chainId,
          rpcUrl,
        };
      } catch (e) {
        // no-op
      }
    }

    // TODO: find a better way to fix the type error
    type ForcedChainType = {
      rpc: string[];
      chainId: number;
      nativeCurrency: { symbol: string; name: string; decimals: number };
      slug: string;
    };

    const mergedOptions = {
      readonlySettings,
      ...sdkOptions,
      supportedChains: supportedChains as any as ForcedChainType[],
    };

    let sdk_: ThirdwebSDK | undefined = undefined;

    if (chainId) {
      // sdk from chainId
      sdk_ = new ThirdwebSDK(
        chainId,
        { ...mergedOptions, clientId, secretKey },
        storageInterface,
      );
    }
    // if we still have no sdk fall back to the first element in chains
    if (!sdk_) {
      if (supportedChains.length > 0) {
        chainId = supportedChains[0].chainId;
        sdk_ = new ThirdwebSDK(chainId, mergedOptions, storageInterface);
      } else {
        console.error(
          "No chains configured, please pass a chain or chains to the ThirdwebProvider",
        );
        return undefined;
      }
    }

    // set the chainId on the sdk instance to compare things later
    (sdk_ as any)._chainId = chainId;

    return sdk_;
  }, [
    activeChainId,
    supportedChains,
    sdkOptions,
    storageInterface,
    clientId,
    secretKey,
  ]);

  useEffect(() => {
    // if we have an sdk and a signer update the signer
    if (sdk && (sdk as any)._chainId === activeChainId) {
      if (signer) {
        sdk.updateSignerOrProvider(signer);
      } else if (activeChainId) {
        sdk.updateSignerOrProvider(activeChainId);
      }
    }
    // we know what we're doing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk, (sdk as any)?._chainId, signer, activeChainId]);

  const ctxValue = useMemo(
    () => ({
      sdk: sdk && (sdk as any)._chainId === activeChainId ? sdk : undefined,
      _inProvider: true as const,
    }),
    [activeChainId, sdk],
  );

  return (
    <ThirdwebSDKContext.Provider value={ctxValue}>
      {children}
    </ThirdwebSDKContext.Provider>
  );
};

/**
 * The `ThirdwebSDKProvider` is used when you want to provide your own wallet connection logic and just use the thirdweb SDK to interact with smart contracts and the blockchain.
 * This means you can use everything in the SDK except for wallet connection-related components and hooks. if you need those please use the `ThirdwebProvider` instead.
 *
 * `ThirdwebSDKProvider` allows you to set a provider & signer to the Thirdweb SDK.
 *
 * @example
 * Wrap your app in the ThirdwebSDKProvider to access the SDK’s functionality from anywhere in your app.
 *
 * ```tsx
 * import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
 * import { ethers } from "ethers";
 *
 * // Example shows how to get the signer from the injected provider ( wallet extension )
 * function Example() {
 *  return (
 *    <ThirdwebSDKProvider
 *      activeChain="ethereum"
 *      clientId="YOUR_CLIENT_ID"
 *      signer={new ethers.providers.Web3Provider(window.ethereum).getSigner()}
 *    >
 *      <App />
 *    </ThirdwebSDKProvider>
 *  )
 * }
 * ```
 *
 * @param props -
 * The props for the ThirdwebSDKProvider component
 *
 * ### clientId (optional)
 * The clientId prop is required to use the thirdweb infrastructure services with the SDK.
 *
 * ### activeChain (optional)
 * The activeChain prop determines which chain you want your app to be operating on.
 *
 * There are 1000+ chains available in the `@thirdweb-dev/chains` package. Import the chain you want and pass it to the `activeChain` prop.
 *
 * You can override the imported object or pass a custom chain object with required properties.
 *
 * You can get a client ID by creating an API key on [thirdweb dashboard](https://thirdweb.com/dashboard/settings/api-keys)
 *
 * ### supportedChains (optional)
 * An array of chains supported by your app.
 * There are 1000+ chains available in the `@thirdweb-dev/chains` package. You can import the chain you want and pass it to the `supportedChains` prop in an array.
 *
 * If not provided, it will default to the default supported chains supported by the thirdweb SDK.
 *
 * ```tsx
 * import { Ethereum, Polygon } from "@thirdweb-dev/chains";
 *
 * function Example() {
 *  return (
 *    <ThirdwebSDKProvider supportedChains={[ Ethereum, Polygon ]} activeChain={Ethereum}>
 *       <App />
 *    </ThirdwebSDKProvider>
 *  )
 * }
 * ```
 *
 * ### signer (optional)
 * A signer is an abstraction of an Ethereum Account, which can be used to sign messages and initiate transactions.
 *
 * Since the ThirdwebSDKProvider is used when you want to provide your own wallet connection logic, you will need to provide a signer prop to inform the SDK of the wallet you want to use to sign transactions.
 *
 * Libraries such as ethers.js, web3.js, wagmi, etc. all provide ways to get a signer.
 *
 * To use this signer with the SDK, pass it to the `signer` prop. If the signer is connected, the SDK will use this wallet to sign transactions for all write operations on the blockchain.
 *
 * ### sdkOptions (optional)
 * The thirdweb SDK Options to pass to the thirdweb SDK which includes Gas settings, gasless transactions, RPC configuration, and more.
 *
 * This Overrides any of the default values for the SDK. If not provided, it uses sensible defaults.
 *
 * ### storageInterface (optional)
 * Override the default [Storage](https://portal.thirdweb.com/infrastructure/storage/overview) interface used by the SDK.
 *
 * It allows you to create an instance of `ThirdwebStorage` with your own customized config, and pass it to the SDK.
 *
 * *This requires the `@thirdweb-dev/storage` package to be installed.*
 *
 * ```tsx
 * import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
 * import {
 *   ThirdwebStorage,
 *   StorageDownloader,
 *   IpfsUploader,
 * } from "@thirdweb-dev/storage";
 *
 * // Configure a custom ThirdwebStorage instance
 * const gatewayUrls = {
 *   "ipfs://": [
 *     "https://gateway.ipfscdn.io/ipfs/",
 *     "https://cloudflare-ipfs.com/ipfs/",
 *     "https://ipfs.io/ipfs/",
 *   ],
 * };
 * const downloader = new StorageDownloader();
 * const uploader = new IpfsUploader();
 * const storage = new ThirdwebStorage({ uploader, downloader, gatewayUrls });
 *
 * // Provide the custom storage instance to the SDK
 * function MyApp() {
 *   return (
 *     <ThirdwebSDKProvider
 *       storageInterface={storage}
 *     >
 *       <YourApp />
 *     </ThirdwebSDKProvider>
 *   );
 * }
 * ```
 *
 * ### authConfig (optional)
 * The configuration object for setting up [Auth](https://portal.thirdweb.com/wallets/auth); allowing users to sign in with their wallet.
 *
 * ### secretKey (optional)
 * secretKey for thirdweb services. This is only required if server side rendering is being used.
 *
 * @public
 */
export const ThirdwebSDKProvider = <TChains extends Chain[]>(
  props: React.PropsWithChildren<ThirdwebSDKProviderProps<TChains>>,
) => {
  const {
    signer,
    children,
    queryClient,
    supportedChains: _supportedChains,
    activeChain,
    clientId,
    ...restProps
  } = props;

  if (!clientId) {
    checkClientIdOrSecretKey(
      "No API key. Please provide a clientId. It is required to access thirdweb's services. You can create a key at https://thirdweb.com/create-api-key",
      clientId,
      undefined,
    );
  }
  const supportedChains = (_supportedChains || defaultChains) as Chain[];

  const supportedChainsNonNull: Chain[] = useMemo(() => {
    const isActiveChainObject =
      typeof activeChain === "object" && activeChain !== null;

    if (!isActiveChainObject) {
      return supportedChains;
    }

    const isActiveChainInSupportedChains = supportedChains.find(
      (c) => c.chainId === activeChain.chainId,
    );

    // if activeChain is not in supportedChains - add it
    if (!isActiveChainInSupportedChains) {
      return [...supportedChains, activeChain];
    }

    // if active chain is in supportedChains - replace it with object in activeChain
    return supportedChains.map((c) =>
      c.chainId === activeChain.chainId ? activeChain : c,
    );
  }, [supportedChains, activeChain]);

  const [supportedChainsWithKey, activeChainIdOrObjWithKey] =
    useUpdateChainsWithClientId(
      supportedChainsNonNull,
      activeChain || supportedChainsNonNull[0],
      clientId,
    );

  const mergedChains = useMemo(() => {
    if (
      !activeChainIdOrObjWithKey ||
      typeof activeChainIdOrObjWithKey === "string" ||
      typeof activeChainIdOrObjWithKey === "number"
    ) {
      return supportedChainsWithKey as Readonly<Chain[]>;
    }

    const _mergedChains = [
      ...supportedChainsWithKey.filter(
        (c) => c.chainId !== activeChainIdOrObjWithKey.chainId,
      ),
      activeChainIdOrObjWithKey,
    ] as Readonly<Chain[]>;
    // return a _mergedChains uniqued by chainId key
    return _mergedChains.filter(
      (chain, index, self) =>
        index === self.findIndex((c) => c.chainId === chain.chainId),
    );
  }, [supportedChainsWithKey, activeChainIdOrObjWithKey]);

  return (
    <ThirdwebConfigProvider
      value={{
        chains: mergedChains as Chain[],
        clientId,
      }}
    >
      <QueryClientProviderWithDefault queryClient={queryClient}>
        <WrappedThirdwebSDKProvider
          signer={signer}
          supportedChains={mergedChains}
          clientId={clientId}
          activeChain={activeChainIdOrObjWithKey}
          {...restProps}
        >
          <ThirdwebConnectedWalletProvider signer={signer}>
            {children}
          </ThirdwebConnectedWalletProvider>
        </WrappedThirdwebSDKProvider>
      </QueryClientProviderWithDefault>
    </ThirdwebConfigProvider>
  );
};
