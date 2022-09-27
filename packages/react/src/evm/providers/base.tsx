import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import { ComponentWithChildren } from "../../core/types/component";
import { RequiredParam } from "../../core/types/shared";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthConfigProvider,
} from "../contexts/thirdweb-auth";
import {
  ThirdwebConnectedWalletProvider,
  useThirdwebConnectedWalletContext,
} from "../contexts/thirdweb-wallet";
import {
  ChainOrRpc,
  SDKOptions,
  SignerOrProvider,
  SUPPORTED_CHAIN_ID,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Signer } from "ethers";
import { createContext, useContext, useEffect, useMemo } from "react";
import invariant from "tiny-invariant";

interface TWSDKContext {
  sdk?: ThirdwebSDK;
  _inProvider?: true;
  desiredChainId: number;
}

const ThirdwebSDKContext = createContext<TWSDKContext>({ desiredChainId: -1 });

export interface ThirdwebSDKProviderProps extends QueryClientProviderProps {
  desiredChainId: RequiredParam<SUPPORTED_CHAIN_ID>;
  provider: ChainOrRpc | SignerOrProvider;

  signer?: Signer;

  sdkOptions?: SDKOptions;
  storageInterface?: ThirdwebStorage;
  authConfig?: ThirdwebAuthConfig;
}

/**
 *
 * @internal
 */
export const WrappedThirdwebSDKProvider: ComponentWithChildren<
  Omit<ThirdwebSDKProviderProps, "signer">
> = ({
  sdkOptions,
  desiredChainId,
  storageInterface,
  provider,
  queryClient,
  authConfig,
  children,
}) => {
  const { signer } = useThirdwebConnectedWalletContext();

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
    <QueryClientProviderWithDefault queryClient={queryClient}>
      <ThirdwebAuthConfigProvider value={authConfig}>
        <ThirdwebSDKContext.Provider value={ctxValue}>
          {children}
        </ThirdwebSDKContext.Provider>
      </ThirdwebAuthConfigProvider>
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
export function useDesiredChainId(): number {
  const { desiredChainId } = useSDKContext();
  return desiredChainId;
}

/**
 * @internal
 */
export function useSDKChainId(): SUPPORTED_CHAIN_ID | undefined {
  const sdk = useSDK();
  return (sdk as any)?._chainId;
}
