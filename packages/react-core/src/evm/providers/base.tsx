import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import { ComponentWithChildren } from "../../core/types/component";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthProvider,
} from "../contexts/thirdweb-auth";
import {
  ThirdwebConnectedWalletProvider,
  useThirdwebConnectedWalletContext,
} from "../contexts/thirdweb-wallet";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { ChainIdOrName, SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers, Signer } from "ethers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";

interface TWSDKContext {
  sdk?: ThirdwebSDK;
  _inProvider?: true;
}

const ThirdwebSDKContext = createContext<TWSDKContext>({});

export interface ThirdwebSDKProviderProps extends QueryClientProviderProps {
  signer?: Signer;
  sdkOptions?: Omit<SDKOptions, "chains">;
  storageInterface?: ThirdwebStorage;
  authConfig?: ThirdwebAuthConfig;
  chains?: Chain[];
  network: ChainIdOrName;

  /**
   * @deprecated - use network instead
   */
  desiredChainId?: number;
  /**
   * @deprecated - use network instead
   */
  provider?: ChainIdOrName | ethers.providers.Provider;
}

/**
 *
 * @internal
 */
export const WrappedThirdwebSDKProvider: ComponentWithChildren<
  Omit<ThirdwebSDKProviderProps, "signer">
> = ({
  sdkOptions = {},
  desiredChainId,
  storageInterface,
  provider,
  queryClient,
  authConfig,
  chains = defaultChains,
  network,
  children,
}) => {
  const { signer } = useThirdwebConnectedWalletContext();

  const [sdk, setSDK] = useState<ThirdwebSDK>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const mergedSDKOptions: SDKOptions = {
      ...sdkOptions,
      chains,
    };
    const _sdk = signer
      ? ThirdwebSDK.fromSigner(
          signer,
          network,
          mergedSDKOptions,
          storageInterface,
        )
      : new ThirdwebSDK(
          provider || network,
          mergedSDKOptions,
          storageInterface,
        );

    setSDK(_sdk);
  }, [
    provider,
    sdkOptions,
    storageInterface,
    desiredChainId,
    network,
    signer,
    chains,
  ]);

  useEffect(() => {
    if (sdk) {
      if (signer) {
        sdk.updateSignerOrProvider(signer);
      } else {
        sdk.updateSignerOrProvider(provider || network);
      }
    }
  }, [signer, sdk, desiredChainId, network, provider]);

  const ctxValue = useMemo(
    () => ({
      sdk,
      _inProvider: true as const,
    }),
    [sdk],
  );

  return (
    <QueryClientProviderWithDefault queryClient={queryClient}>
      <ThirdwebAuthProvider value={authConfig}>
        <ThirdwebSDKContext.Provider value={ctxValue}>
          {children}
        </ThirdwebSDKContext.Provider>
      </ThirdwebAuthProvider>
    </QueryClientProviderWithDefault>
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
> = ({ signer, children, ...restProps }) => {
  return (
    <ThirdwebConnectedWalletProvider signer={signer}>
      <WrappedThirdwebSDKProvider {...restProps}>
        {children}
      </WrappedThirdwebSDKProvider>
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
