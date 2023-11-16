import { useMemo, useEffect } from "react";
import { QueryClientProviderWithDefault } from "../../core/providers/query-client";
import { ThirdwebConfigProvider } from "../contexts/thirdweb-config";
import { ThirdwebSDKContext } from "../contexts/thirdweb-sdk";
import { ThirdwebConnectedWalletProvider } from "../contexts/thirdweb-wallet";
import { useUpdateChainsWithClientId } from "../hooks/chain-hooks";
import { ThirdwebSDKProviderProps } from "./types";
import { Chain, defaultChains, getValidChainRPCs } from "@thirdweb-dev/chains";
import { SDKOptionsOutput, ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { checkClientIdOrSecretKey } from "@thirdweb-dev/sdk/internal/react-core";

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
  supportedChains: _supportedChains,
  activeChain,
  clientId,
  ...restProps
}: React.PropsWithChildren<ThirdwebSDKProviderProps<TChains>>) => {
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
