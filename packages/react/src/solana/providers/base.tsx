import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import { ComponentWithChildren } from "../../core/types/component";
import { RequiredParam } from "../../core/types/shared";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { Network, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { createContext, useContext, useEffect, useState } from "react";
import invariant from "tiny-invariant";

interface ThirdwebSDKProviderProps extends QueryClientProviderProps {
  network: RequiredParam<Network>;
  wallet?: WalletContextState;
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
> = ({ children, network, queryClient, wallet }) => {
  const [sdk, setSDK] = useState<ThirdwebSDK | null>(null);

  useEffect(() => {
    if (network) {
      const _sdk = ThirdwebSDK.fromNetwork(network);
      (_sdk as any)._network = network;
      setSDK(_sdk);
    } else {
      setSDK(null);
    }
  }, [network]);

  useEffect(() => {
    if (sdk) {
      if (wallet?.publicKey) {
        sdk.wallet.connect(wallet);
      } else {
        sdk.wallet.disconnect();
      }
    }
  }, [sdk, wallet]);

  return (
    <QueryClientProviderWithDefault queryClient={queryClient}>
      <ThirdwebSDKContext.Provider
        value={{ sdk, desiredNetwork: network || "unknown", _inProvider: true }}
      >
        {children}
      </ThirdwebSDKContext.Provider>
    </QueryClientProviderWithDefault>
  );
};

interface ThirdwebSDKContext {
  sdk: ThirdwebSDK | null;
  desiredNetwork: string;
  _inProvider?: true;
}
const ThirdwebSDKContext = createContext<ThirdwebSDKContext>({
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
