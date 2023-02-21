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
import { createContext, useContext, useMemo } from "react";
import invariant from "tiny-invariant";

interface TWSDKContext {
  sdk?: ThirdwebSDK;
  _inProvider?: true;
}

const ThirdwebSDKContext = createContext<TWSDKContext>({});

function resolveChainIdFromNetwork(
  network?: number | string,
  chains: Readonly<Chain[]> = defaultChains,
): number | undefined {
  let chainId: number | undefined = undefined;
  // try to resolve the chainId
  if (typeof network === "number") {
    if (chains.find((c) => c.chainId === network)) {
      chainId = network;
    }
  } else if (typeof network === "string") {
    const chain = chains.find((c) => c.slug === network);
    if (chain) {
      chainId = chain.chainId;
    }
  }
  return chainId;
}

// this allows autocomplete to work for the chainId prop but still allows `number` and `string` to be passed (for dynamically passed chain data)
type ChainIdIsh = (string | number) & { __chainIdIsh: never };

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
  activeChain?:
    | TChains[number]["chainId"]
    | TChains[number]["slug"]
    | ChainIdIsh
    | Chain;

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
  thirdwebApiKey = DEFAULT_API_KEY,
  infuraApiKey,
  alchemyApiKey,
}: React.PropsWithChildren<
  Omit<ThirdwebSDKProviderProps<TChains>, "authConfig">
>) => {
  const activeChainId = useMemo(() => {
    if (!activeChain) {
      return undefined;
    }
    if (typeof activeChain === "string" || typeof activeChain === "number") {
      return activeChain;
    }
    return activeChain.chainId;
  }, [activeChain]);

  const sdk = useMemo(() => {
    // on the server we can't do anything (?)
    if (typeof window === "undefined") {
      return undefined;
    }
    let chainId = resolveChainIdFromNetwork(activeChainId, supportedChains);
    if (signer && !chainId) {
      try {
        chainId = (signer?.provider as any)?._network?.chainId;
      } catch (e) {}
    }
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

    const mergedOptions = {
      readonlySettings,
      ...sdkOptions,
      chains: supportedChains,
    };

    let sdk_: ThirdwebSDK | undefined = undefined;

    if (signer) {
      // sdk from signer
      sdk_ = new ThirdwebSDK(
        signer,
        { ...mergedOptions, infuraApiKey, alchemyApiKey, thirdwebApiKey },
        storageInterface,
      );
    } else if (chainId) {
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
        return undefined;
      }
    }

    return sdk_;
  }, [
    activeChainId,
    alchemyApiKey,
    infuraApiKey,
    supportedChains,
    sdkOptions,
    signer,
    storageInterface,
    thirdwebApiKey,
  ]);

  const ctxValue = useMemo(
    () => ({
      sdk,
      _inProvider: true as const,
    }),
    [sdk],
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
  thirdwebApiKey,
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
    return [...supportedChains, activeChain] as Readonly<Chain[]>;
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
  return (sdk?.getProvider() as any)?._network?.chainId;
}
