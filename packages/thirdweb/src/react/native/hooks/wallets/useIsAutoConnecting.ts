import { useIsAutoConnectingCore } from "../../../core/hooks/wallets/useIsAutoConnecting.js";
import { connectionManager } from "../../index.js";

/**
 * A hook to check if the auto connect is in progress.
 * @example
 * ```jsx
 * function Example() {
 *   const isAutoConnecting = useIsAutoConnecting();
 *
 *   return <div> ... </div>;
 * }
 * ```
 * @returns A boolean indicating if the auto connect is in progress.
 * @walletConnection
 */
export function useIsAutoConnecting() {
  return useIsAutoConnectingCore(connectionManager);
}
