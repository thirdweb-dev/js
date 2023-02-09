import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthProvider,
} from "../contexts/thirdweb-auth";
import { ThirdwebConnectedWalletProvider } from "../contexts/thirdweb-wallet";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
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
    let chainId = resolveChainIdFromNetwork(activeChainId, mergedChains);
    if (signer && !chainId) {
      try {
        chainId = (signer?.provider as any)?._network?.chainId;
      } catch (e) {}
    }
    const supportedChain = mergedChains.find((c) => c.chainId === chainId);

    if (!supportedChain && chainId !== undefined) {
      console.warn(
        `The chainId ${chainId} is not in the configured chains, please add it to the ThirdwebProvider`,
      );
      // reset the chainId as to not trigger an error in the sdk constructor
      chainId = undefined;
    }

    let readonlySettings: SDKOptionsOutput["readonlySettings"] = undefined;

    if (supportedChain && supportedChain.rpc.length > 0) {
      readonlySettings = {
        chainId: supportedChain.chainId,
        rpcUrl: supportedChain.rpc[0],
      };
    }

    const mergedOptions = {
      readonlySettings,
      ...sdkOptions,
      chains: mergedChains,
    };

    let sdk_: ThirdwebSDK | undefined = undefined;

    if (signer) {
      // sdk from signer

      sdk_ = ThirdwebSDK.fromSigner(
        signer,
        chainId,
        mergedOptions,
        storageInterface,
      );
    } else if (chainId) {
      // sdk from chainId
      sdk_ = new ThirdwebSDK(chainId, mergedOptions, storageInterface);
    }
    // if we still have no sdk fall back to the first element in chains
    if (!sdk_) {
      if (mergedChains.length > 0) {
        chainId = mergedChains[0].chainId;
        sdk_ = new ThirdwebSDK(chainId, mergedOptions, storageInterface);
      } else {
        console.error(
          "No chains configured, please pass a chain or chains to the ThirdwebProvider",
        );
        return undefined;
      }
    }

    return sdk_;
  }, [activeChainId, mergedChains, sdkOptions, signer, storageInterface]);

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
  ...restProps
}: React.PropsWithChildren<ThirdwebSDKProviderProps<TChains>>) => {
  return (
    <ThirdwebConnectedWalletProvider signer={signer}>
      <QueryClientProviderWithDefault queryClient={queryClient}>
        <ThirdwebAuthProvider value={authConfig}>
          <WrappedThirdwebSDKProvider signer={signer} {...restProps}>
            {children}
          </WrappedThirdwebSDKProvider>
        </ThirdwebAuthProvider>
      </QueryClientProviderWithDefault>
    </ThirdwebConnectedWalletProvider>
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
