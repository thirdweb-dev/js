"use client";
import { useMemo } from "react";
import { webLocalStorage } from "../../../utils/storage/webStorage.js";
import {
  type ConnectionManager,
  createConnectionManager,
} from "../../../wallets/manager/index.js";
import { ThirdwebProviderCore } from "../../core/providers/thirdweb-provider.js";

/**
 * The ThirdwebProvider is component is a provider component that sets up the React Query client.
 * @param props - The props for the ThirdwebProvider
 * @example
 * ```jsx
 * import { ThirdwebProvider } from "thirdweb/react";
 *
 * function Example() {
 *  return (
 *    <ThirdwebProvider>
 *      <App />
 *    </ThirdwebProvider>
 *   )
 * }
 * ```
 * @component
 * @walletConnection
 */
export function ThirdwebProvider(
  props: React.PropsWithChildren<{
    connectionManager?: ConnectionManager;
  }>,
) {
  const connectionManager = useMemo(
    () => props.connectionManager || createConnectionManager(webLocalStorage),
    [props.connectionManager],
  );

  return (
    <ThirdwebProviderCore manager={connectionManager}>
      {props.children}
    </ThirdwebProviderCore>
  );
}
