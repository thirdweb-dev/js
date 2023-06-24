import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import { RequiredParam } from "../../core/query-utils/required-param";
import { ComponentWithChildren } from "../../core/types/component";
import {
  ThirdwebAuthConfig,
  ThirdwebAuthProvider,
} from "../contexts/thirdweb-auth";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { Network, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";

interface ThirdwebSDKProviderProps extends QueryClientProviderProps {
  network: RequiredParam<Network>;
  wallet?: WalletContextState;
  authConfig?: ThirdwebAuthConfig;
}

/**
 * Gives access to the ThirdwebSDK instance and other useful hooks to the rest of the app.
 * Requires to be wrapped with a ConnectionProvider and a WalletProvider from @solana/wallet-adapter-react.
 * @example
 * ```tsx
 * import { useWallet } from "@solana/wallet-adapter-react";
 * import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
 *
 * const ThirdwebApp = () => {
 *  const wallet = useWallet();
 *  return (
 *    <ThirdwebSDKProvider network={"devnet"} wallet={wallet}>
 *      <YourApp />
 *    </ThirdwebSDKProvider>
 * )};
 * ```
 */
export const ThirdwebSDKProvider: ComponentWithChildren<
  ThirdwebSDKProviderProps
> = ({ children, network, queryClient, wallet, authConfig }) => {
  const [sdk, setSDK] = useState<ThirdwebSDK | null>(null);

  useEffect(() => {
    if (network) {
      const _sdk = ThirdwebSDK.fromNetwork(network);
      if (wallet && wallet.publicKey) {
        _sdk.wallet.connect(wallet);
      }
      (_sdk as any)._network = network;
      setSDK(_sdk);
    } else {
      setSDK(null);
    }
    // disabled wallet on purpose because we handle that below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  useEffect(() => {
    if (
      wallet &&
      wallet.publicKey &&
      sdk &&
      (sdk as any)._network === network
    ) {
      sdk.wallet.connect(wallet);
      return;
    }
  }, [network, sdk, wallet]);

  const ctxValue = useMemo(
    () =>
      ({
        sdk,
        desiredNetwork: network || "unknown",
        _inProvider: true,
      } as const),
    [sdk, network],
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

interface ThirdwebSDKContext {
  sdk: ThirdwebSDK | null;
  desiredNetwork: string;
  _inProvider?: true;
}
const ThirdwebSDKContext = /* @__PURE__ */ createContext<ThirdwebSDKContext>({
  sdk: null,
  desiredNetwork: "unknown",
});

export function useSDK() {
  const ctxValue = useContext(ThirdwebSDKContext);
  invariant(
    ctxValue._inProvider,
    "useSDK must be used within a ThirdwebSDKProvider",
  );
  if (
    !ctxValue.sdk ||
    (ctxValue.sdk as any)._network !== ctxValue.desiredNetwork
  ) {
    return null;
  }
  return ctxValue.sdk;
}
