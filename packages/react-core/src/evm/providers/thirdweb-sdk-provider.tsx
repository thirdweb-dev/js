import { DEFAULT_API_KEY } from "../../core/constants/rpc";
import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthProvider,
} from "../contexts/thirdweb-auth";
import { ThirdwebConfigProvider } from "../contexts/thirdweb-config";
import { ThirdwebConnectedWalletProvider } from "../contexts/thirdweb-wallet";
import { Chain, defaultChains, getChainRPC } from "@thirdweb-dev/chains";
import {
  SDKOptions,
  SDKOptionsOutput,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk/evm";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { Signer } from "ethers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";

interface TWSDKContext {
  sdk?: ThirdwebSDK;
  _inProvider?: true;
}

const ThirdwebSDKContext = createContext<TWSDKContext>({});

export interface ThirdwebSDKProviderProps<
  TChains extends Chain[] = typeof defaultChains,
> extends QueryClientProviderProps {
  // the chains that we want to configure - optional, defaults to defaultChains
  supportedChains?: Readonly<TChains>;
  // a possible signer - optional, defaults to undefined
  signer?: Signer;

  // additional SDK options (forwarded to the SDK initializer)
  sdkOptions?: Omit<SDKOptions, "chains">;
  // storage
  storageInterface?: ThirdwebStorage;
  // if u want to use auth, pass this
  authConfig?: ThirdwebAuthConfig;

  // the network to use - optional, defaults to undefined
  activeChain?: TChains[number]["chainId"] | TChains[number]["slug"] | Chain;

  // api keys that can be passed
  thirdwebApiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
}

/**
 *
 * @internal
 */
const WrappedThirdwebSDKProvider = <
  TChains extends Chain[] = typeof defaultChains,
>({
  sdkOptions = {},
  storageInterface,
  // @ts-expect-error - different subtype of Chain[] but this works fine
  supportedChains = defaultChains,
  activeChain,
  signer,
  children,
  thirdwebApiKey,
  infuraApiKey,
  alchemyApiKey,
}: React.PropsWithChildren<
  Omit<ThirdwebSDKProviderProps<TChains>, "authConfig">
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

  const [sdk, setSDK] = useState<ThirdwebSDK | undefined>(undefined);

  useEffect(() => {
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
        const rpcUrl = getChainRPC(supportedChain, {
          thirdwebApiKey,
          infuraApiKey,
          alchemyApiKey,
        });

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
      nativeCurrency: { symbol: string; name: string; decimals: 18 };
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
        { ...mergedOptions, infuraApiKey, alchemyApiKey, thirdwebApiKey },
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
        setSDK(undefined);
        return;
      }
    }

    // set the chainId on the sdk instance to compare things later
    (sdk_ as any)._chainId = chainId;

    setSDK(sdk_);
  }, [
    activeChainId,
    alchemyApiKey,
    infuraApiKey,
    supportedChains,
    sdkOptions,
    storageInterface,
    thirdwebApiKey,
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
 * A basic wrapper around the Thirdweb SDK.
 *
 * You can use this in order to be able to pass a provider & signer directly to the SDK.
 *
 * @remarks Utilizing this provider will mean hooks for wallet management are not available, if you need those please use the {@link ThirdwebProvider} instead.
 *
 * @public
 */
export const ThirdwebSDKProvider = <
  TChains extends Chain[] = typeof defaultChains,
>({
  signer,
  children,
  queryClient,
  authConfig,
  // @ts-expect-error - different subtype of Chain[] but this works fine
  supportedChains = defaultChains,
  activeChain,
  thirdwebApiKey = DEFAULT_API_KEY,
  alchemyApiKey,
  infuraApiKey,
  ...restProps
}: React.PropsWithChildren<ThirdwebSDKProviderProps<TChains>>) => {
  const mergedChains = useMemo(() => {
    if (
      !activeChain ||
      typeof activeChain === "string" ||
      typeof activeChain === "number"
    ) {
      return supportedChains as Readonly<Chain[]>;
    }

    const _mergedChains = [...supportedChains, activeChain] as Readonly<
      Chain[]
    >;
    // return a _mergedChains uniqued by chainId key
    return _mergedChains.filter(
      (chain, index, self) =>
        index === self.findIndex((c) => c.chainId === chain.chainId),
    );
  }, [supportedChains, activeChain]);

  return (
    <ThirdwebConfigProvider
      value={{
        chains: mergedChains as Chain[],
        thirdwebApiKey,
        alchemyApiKey,
        infuraApiKey,
      }}
    >
      <ThirdwebConnectedWalletProvider signer={signer}>
        <QueryClientProviderWithDefault queryClient={queryClient}>
          <ThirdwebAuthProvider value={authConfig}>
            <WrappedThirdwebSDKProvider
              signer={signer}
              // @ts-expect-error - different subtype of Chain[] but this works fine
              supportedChains={mergedChains}
              thirdwebApiKey={thirdwebApiKey}
              alchemyApiKey={alchemyApiKey}
              infuraApiKey={infuraApiKey}
              activeChain={activeChain}
              {...restProps}
            >
              {children}
            </WrappedThirdwebSDKProvider>
          </ThirdwebAuthProvider>
        </QueryClientProviderWithDefault>
      </ThirdwebConnectedWalletProvider>
    </ThirdwebConfigProvider>
  );
};

/**
 * @internal
 */
function useSDKContext(): TWSDKContext {
  const ctx = useContext(ThirdwebSDKContext);
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
export function useSDKChainId(): number | undefined {
  const sdk = useSDK();
  return (sdk as any)?._chainId;
}
