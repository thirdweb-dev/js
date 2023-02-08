import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import { ComponentWithChildren } from "../../core/types/component";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthProvider,
} from "../contexts/thirdweb-auth";
import { ThirdwebConnectedWalletProvider } from "../contexts/thirdweb-wallet";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { ChainIdOrName, SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
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
  network?: ChainIdOrName,
  chains: Chain[] = defaultChains,
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

export interface ThirdwebSDKProviderProps extends QueryClientProviderProps {
  // the chains that we want to configure - optional, defaults to defaultChains
  chains?: Chain[];
  // a possible signer - optional, defaults to undefined
  signer?: Signer;

  // additional SDK options (forwarded to the SDK initializer)
  sdkOptions?: Omit<SDKOptions, "chains">;
  // storage
  storageInterface?: ThirdwebStorage;
  // if u want to use auth, pass this
  authConfig?: ThirdwebAuthConfig;

  // the network to use - optional, defaults to undefined
  network?: ChainIdOrName;
}

/**
 *
 * @internal
 */
const WrappedThirdwebSDKProvider: ComponentWithChildren<
  Omit<ThirdwebSDKProviderProps, "queryClient" | "authConfig">
> = ({
  sdkOptions = {},
  storageInterface,
  chains = defaultChains,
  network,
  signer,
  children,
}) => {
  const sdk = useMemo(() => {
    // on the server we can't do anything (?)
    if (typeof window === "undefined") {
      return undefined;
    }
    let chainId = resolveChainIdFromNetwork(network, chains);

    const mergedOptions = {
      ...sdkOptions,
      chains,
    };

    let sdk_: ThirdwebSDK | undefined = undefined;

    if (signer) {
      // sdk from signer

      if (!chainId) {
        // try to get the chainId off of the signer sync
        try {
          chainId = (signer?.provider as any)?._network?.chainId;
        } catch (e) {}
      }
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
      if (chains.length > 0) {
        chainId = chains[0].chainId;
        sdk_ = new ThirdwebSDK(chainId, mergedOptions, storageInterface);
      } else {
        console.error(
          "No chains configured, please pass a chain or chains to the ThirdwebProvider",
        );
        return undefined;
      }
    }

    (sdk_ as any)._chainId = chainId;

    return sdk_;
  }, [chains, network, sdkOptions, signer, storageInterface]);

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
export const ThirdwebSDKProvider: ComponentWithChildren<
  ThirdwebSDKProviderProps
> = ({ signer, children, queryClient, authConfig, ...restProps }) => {
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
  return (sdk as any)?._chainId;
}
