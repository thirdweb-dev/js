import { DEFAULT_API_KEY } from "../../core/constants/rpc";
import { QueryClientProviderWithDefault } from "../../core/providers/query-client";
import { ThirdwebConfigProvider } from "../contexts/thirdweb-config";
import { ThirdwebConnectedWalletProvider } from "../contexts/thirdweb-wallet";
import { useUpdateChainsWithApiKeys } from "../hooks/chain-hooks";
import { ThirdwebSDKProviderProps } from "./types";
import { Chain, defaultChains, getChainRPC } from "@thirdweb-dev/chains";
import { SDKOptionsOutput, ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { createContext, useContext, useEffect, useMemo } from "react";
import invariant from "tiny-invariant";

interface TWSDKContext {
  sdk?: ThirdwebSDK;
  _inProvider?: true;
}

const ThirdwebSDKContext = /* @__PURE__ */ createContext<TWSDKContext>({});

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
  apiKey,
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
        const rpcUrl = getChainRPC(supportedChain, {
          apiKey,
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
        { ...mergedOptions, apiKey },
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
  }, [activeChainId, supportedChains, sdkOptions, storageInterface, apiKey]);

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
export const ThirdwebSDKProvider = <TChains extends Chain[]>({
  signer,
  children,
  queryClient,
  supportedChains,
  activeChain,
  apiKey,
  ...restProps
}: React.PropsWithChildren<ThirdwebSDKProviderProps<TChains>>) => {
  if (!apiKey) {
    apiKey = DEFAULT_API_KEY;
    noAPIKeyWarning();
  }
  const supportedChainsNonNull = useMemo(() => {
    return supportedChains || (defaultChains as any as TChains);
  }, [supportedChains]);
  const [supportedChainsWithKey, activeChainIdOrObjWithKey] =
    useUpdateChainsWithApiKeys(
      supportedChainsNonNull,
      activeChain || supportedChainsNonNull[0],
      apiKey,
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
        apiKey,
      }}
    >
      <ThirdwebConnectedWalletProvider signer={signer}>
        <QueryClientProviderWithDefault queryClient={queryClient}>
          <WrappedThirdwebSDKProvider
            signer={signer}
            supportedChains={mergedChains}
            apiKey={apiKey}
            activeChain={activeChainIdOrObjWithKey}
            {...restProps}
          >
            {children}
          </WrappedThirdwebSDKProvider>
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

let noAPIKeyWarningLogged = false;
function noAPIKeyWarning() {
  if (noAPIKeyWarningLogged) {
    return;
  }
  noAPIKeyWarningLogged = true;
  console.warn(
    "No API key provided to <ThirdwebSDKProvider />. You will have limited access to thirdweb's services for storage, RPC, and account abstraction. You can get an API key from https://thirdweb.com/dashboard/",
  );
}
